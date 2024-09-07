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

eventsApp.post('/create', upload.fields([
    { name: 'mainLogo', maxCount: 1 },
    { name: 'images', maxCount: 15 } // Allow up to 15 images
]), async (req, res) => {
    try {
        const eventsCollection = req.app.get('events');
        const deletedevents = req.app.get('deletedevents');
        const gridfsBucket = req.app.get('gridfsBucket');
        const yearsCollection = req.app.get('years'); // Assuming you have a collection named 'years'

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

        // Insert the new event into the database
        const result = await eventsCollection.insertOne(newEvent);
        const eventId = result.insertedId; // The generated event ID by MongoDB

        // Extract the year from dateOfEvent and store it
        const eventYear = new Date(dateOfEvent).getFullYear();

        // Check if the year document exists in the years collection
        const yearDoc = await yearsCollection.findOne({ year: eventYear });

        if (yearDoc) {
            // If the document for that year exists, push the event ID into the array
            await yearsCollection.updateOne(
                { year: eventYear },
                { $push: { events: eventId } }
            );
        } else {
            // If no document exists for that year, create a new one
            await yearsCollection.insertOne({
                year: eventYear,
                events: [eventId]
            });
        }

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
        const deletedEventsCollection = req.app.get('deletedevents'); // Deleted events collection
        const gridfsBucket = req.app.get('gridfsBucket'); // Get the GridFS bucket

        // Find the event in the events collection
        const event = await eventsCollection.findOne({ eventname: eventName });
        if (!event) {
            return res.status(404).send({ message: 'Event not found' });
        }

        // Move the event details to the deletedevents collection
        const deletedEvent = {
            ...event,
            deletedBy: req.query.username, // Add username of the user deleting the event
        };

        await deletedEventsCollection.insertOne(deletedEvent);

        // Delete the event from the events collection (do NOT delete images from GridFS)
        const deletionResult = await eventsCollection.deleteOne({ eventname: eventName });

        if (deletionResult.deletedCount === 0) {
            return res.status(404).send({ message: 'Event not found' });
        }

        res.status(200).send({ message: 'Event deleted and logged successfully' });
    } catch (error) {
        console.error('Error deleting event:', error);
        res.status(500).send({ message: 'Failed to delete event', error: error.message });
    }
});

// Delete an image from an event

eventsApp.delete('/events', async (req, res) => {
    try {
        const eventName = decodeURIComponent(req.query.eventname);
        console.log('Event Name:', eventName); // Debug log

        const eventsCollection = req.app.get('events');
        const deletedEventsCollection = req.app.get('deletedevents'); // Deleted events collection
        const yearsCollection = req.app.get('years'); // Years collection

        // Find the event in the events collection
        const event = await eventsCollection.findOne({ eventname: eventName });
        if (!event) {
            console.log('Event not found'); // Debug log
            return res.status(404).send({ message: 'Event not found' });
        }

        const eventId = event._id;
        const eventYear = new Date(event.dateOfEvent).getFullYear();
        console.log('Event Year:', eventYear); // Debug log
        console.log('Event ID:', eventId); // Debug log

        // Move the event details to the deletedevents collection
        const deletedEvent = {
            ...event,
            deletedBy: req.query.username, // Add username of the user deleting the event
        };

        await deletedEventsCollection.insertOne(deletedEvent);
        console.log('Event moved to deletedEventsCollection'); // Debug log

        // Delete the event from the events collection (do NOT delete images from GridFS)
        const deletionResult = await eventsCollection.deleteOne({ eventname: eventName });
        if (deletionResult.deletedCount === 0) {
            console.log('Event not found during deletion'); // Debug log
            return res.status(404).send({ message: 'Event not found' });
        }

        // Remove the event ID from the years collection
        const pullResult = await yearsCollection.updateOne(
            { year: eventYear },
            { $pull: { events: ObjectId(eventId) } } // Ensure correct type is used
        );

        console.log('Pull Result:', pullResult); // Debug log
        if (pullResult.modifiedCount === 0) {
            console.log('No document was updated in the years collection'); // Debug log
        }

        res.status(200).send({ message: 'Event deleted and logged successfully' });
    } catch (error) {
        console.error('Error deleting event:', error);
        res.status(500).send({ message: 'Failed to delete event', error: error.message });
    }
});


eventsApp.delete('/events/:eventname/images/:index', async (req, res) => {
    try {
        const { eventname, index } = req.params;
        const eventsCollection = req.app.get('events');
        const gridfsBucket = req.app.get('gridfsBucket');

        // Find the event by name
        const event = await eventsCollection.findOne({ eventname });
        if (!event) {
            return res.status(404).send({ message: 'Event not found' });
        }

        // Ensure index is valid and within range
        const imageIndex = parseInt(index, 10);
        if (isNaN(imageIndex) || imageIndex < 0 || imageIndex >= event.imagesIds.length) {
            return res.status(400).send({ message: 'Invalid image index' });
        }

        // Get the imageId based on the index
        const imageId = event.imagesIds[imageIndex];
        if (!ObjectId.isValid(imageId)) {
            return res.status(400).send({ message: 'Invalid image ID' });
        }

        // Remove the image from GridFS
        await gridfsBucket.delete(new ObjectId(imageId)); // Proper deletion method

        // Update the event to remove the image ID from the imagesIds array
        await eventsCollection.updateOne(
            { eventname },
            { $pull: { imagesIds: imageId } }
        );

        res.status(200).send({ message: 'Image deleted successfully' });
    } catch (error) {
        console.error('Error deleting image:', error);
        res.status(500).send({ message: 'Failed to delete image', error: error.message });
    }
});


module.exports = eventsApp;
