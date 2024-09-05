const express = require('express');
const multer = require('multer');
const { GridFSBucket, ObjectId } = require('mongodb');
const eventsApp = express.Router();

// Use memory storage for uploaded files
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Function to get image data by ID from GridFS
const getImageDataById = async (imageId, gridfsBucket) => {
    try {
        const downloadStream = gridfsBucket.openDownloadStream(new ObjectId(imageId));

        return new Promise((resolve, reject) => {
            let data = [];
            downloadStream.on('data', chunk => data.push(chunk));
            downloadStream.on('end', () => resolve(Buffer.concat(data)));
            downloadStream.on('error', reject);
        });
    } catch (error) {
        throw new Error('Error fetching image data: ' + error.message);
    }
};

// Create a new event
eventsApp.post('/create', upload.fields([
    { name: 'mainLogo', maxCount: 1 },
    { name: 'images', maxCount: 15 } // Allow up to 100 images
]), async (req, res) => {
    try {
        const eventsCollection = req.app.get('events');
        const deletedevents = req.app.get('deletedevents');
        const gridfsBucket = req.app.get('gridfsBucket');

        const { eventname, dateOfEvent } = req.body;

        // Check if the event already exists
        const alreadyinserted = await eventsCollection.findOne({ eventname });
        const alreadydeleted = await deletedevents.findOne({ eventname });

        if (alreadyinserted) {
            return res.status(401).send({ message: 'Event already exists' });
        } else if (alreadydeleted) {
            return res.status(401).send({ message: 'Event name already exists in deleted events. Try changing the event name.' });
        }

        // Create the new event object
        const newEvent = {
            eventname,
            dateOfEvent,
            mainLogoId: null,
            imagesIds: []
        };

        // Handle the uploaded main logo file
        if (req.files['mainLogo'] && req.files['mainLogo'].length > 0) {
            const mainLogo = req.files['mainLogo'][0];
            const mainLogoId = await new Promise((resolve, reject) => {
                const uploadStream = gridfsBucket.openUploadStream(mainLogo.originalname, {
                    contentType: mainLogo.mimetype
                });

                uploadStream.on('finish', () => resolve(uploadStream.id.toString()));
                uploadStream.on('error', reject);
                uploadStream.end(mainLogo.buffer);
            });

            newEvent.mainLogoId = mainLogoId;
        }

        // Handle the uploaded images files
        if (req.files['images'] && req.files['images'].length > 0) {
            for (let file of req.files['images']) {
                const imageId = await new Promise((resolve, reject) => {
                    const uploadStream = gridfsBucket.openUploadStream(file.originalname, {
                        contentType: file.mimetype
                    });

                    uploadStream.on('finish', () => resolve(uploadStream.id.toString()));
                    uploadStream.on('error', reject);
                    uploadStream.end(file.buffer);
                });

                newEvent.imagesIds.push(imageId);
            }
        }

        // Insert the new event into the database after all uploads are complete
        await eventsCollection.insertOne(newEvent);

        return res.status(201).send({ message: 'Event created successfully', event: newEvent });

    } catch (error) {
        console.error('Error creating event:', error);
        return res.status(500).send({ message: 'Failed to create event', error: error.message });
    }
});

// Get all events with pagination
eventsApp.get('/events', async (req, res) => {
    try {
        const eventsCollection = req.app.get('events');
        const gridfsBucket = req.app.get('gridfsBucket');
        const skip = parseInt(req.query.skip) || 0;
        const limit = parseInt(req.query.limit) || 10;

        // Fetch the events with pagination
        const eventsList = await eventsCollection.find()
            .skip(skip)
            .limit(limit)
            .toArray();

        // Fetch only the main logo data for each event
        const eventsWithMainLogo = await Promise.all(eventsList.map(async (event) => {
            const mainLogoData = event.mainLogoId ? await getImageDataById(event.mainLogoId, gridfsBucket) : null;

            return {
                ...event,
                mainLogoData: mainLogoData ? mainLogoData.toString('base64') : null,
            };
        }));

        res.status(200).send({ message: 'Events retrieved successfully', payload: eventsWithMainLogo });
    } catch (error) {
        console.error('Error fetching events:', error);
        res.status(500).send({ message: 'Failed to retrieve events', error: error.message });
    }
});

// Endpoint to fetch event data including images from GridFS
eventsApp.get('/events/:eventname', async (req, res) => {
    try {
        const eventsCollection = req.app.get('events');
        const gridfsBucket = req.app.get('gridfsBucket'); 
        const eventname = req.params.eventname;
        // Get pagination parameters from query string
        const skip = parseInt(req.query.skip) || 0;
        const limit = parseInt(req.query.limit) || 10;

        const event = await eventsCollection.findOne({ eventname });
        if (!event) {
            return res.status(404).send({ message: 'Event not found' });
        }

        if (!event.imagesIds || !Array.isArray(event.imagesIds)) {
            return res.status(200).send({ payload: [] });
        }

        // Paginate the image ids
        const paginatedImageIds = event.imagesIds.slice(skip, skip + limit);

        // Fetch images based on paginated IDs
        const imagePromises = paginatedImageIds.map(async imageId => {
            try {
                const imageData = await getImageDataById(imageId, gridfsBucket);
                return `data:image/jpeg;base64,${imageData.toString('base64')}`;
            } catch (error) {
                console.error(`Error fetching image ${imageId}:`, error);
                return null;
            }
        });

        const images = await Promise.all(imagePromises);
        const filteredImages = images.filter(image => image !== null);

        res.status(200).send({ payload: filteredImages });
    } catch (error) {
        console.error('Error fetching event images:', error);
        res.status(500).send({ message: 'Failed to retrieve images', error: error.message });
    }
});


// Add additional images to an event by eventname
eventsApp.post('/events/:eventname/images', upload.array('images', 15), async (req, res) => {
    try {
        const eventsCollection = req.app.get('events');
        const gridfsBucket = req.app.get('gridfsBucket');
        const eventname = req.params.eventname;

        // Find the event
        const event = await eventsCollection.findOne({ eventname });
        if (!event) {
            return res.status(404).send({ message: 'Event not found' });
        }

        // Upload images and collect their IDs
        const imageUploadPromises = req.files.map(file => {
            return new Promise((resolve, reject) => {
                const uploadStream = gridfsBucket.openUploadStream(file.originalname, {
                    contentType: file.mimetype
                });
                
                uploadStream.on('finish', () => resolve(uploadStream.id.toString()));
                uploadStream.on('error', reject);
                uploadStream.end(file.buffer);
            });
        });

        // Wait for all uploads to complete
        const imageIds = await Promise.all(imageUploadPromises);

        // Update the event with the new image IDs
        await eventsCollection.updateOne(
            { eventname },
            { $push: { imagesIds: { $each: imageIds } } }
        );

        // Send success response
        res.status(200).send({ message: 'Images uploaded successfully', payload: { images: imageIds } });
        
    } catch (error) {
        console.error('Error uploading images:', error);
        res.status(500).send({ message: 'Failed to upload images', error: error.message });
    }
});


// Delete an event by eventname
eventsApp.delete('/events', async (req, res) => {
    try {
        const eventName = decodeURIComponent(req.query.eventname);
        const eventsCollection = req.app.get('events');
        const gridfsBucket = req.app.get('gridfsBucket'); // Get the GridFS bucket

        const event = await eventsCollection.findOne({ eventname: eventName });
        if (!event) {
            return res.status(404).send({ message: 'Event not found' });
        }

        // Delete the main logo and images from GridFS
        if (event.mainLogoId) {
            await gridfsBucket.delete(new ObjectId(event.mainLogoId));
        }
        if (event.imagesIds && event.imagesIds.length > 0) {
            for (const imageId of event.imagesIds) {
                await gridfsBucket.delete(new ObjectId(imageId));
            }
        }

        const deletionResult = await eventsCollection.deleteOne({ eventname: eventName });

        if (deletionResult.deletedCount === 0) {
            return res.status(404).send({ message: 'Event not found' });
        }

        res.status(200).send({ message: 'Event deleted successfully' });
    } catch (error) {
        console.error('Error deleting event:', error);
        res.status(500).send({ message: 'Failed to delete event', error: error.message });
    }
});

module.exports = eventsApp;
