/* 
Backend Routes:
Creating New Event
   --Storing of Event details in Events,Years Collection
   --Event Name is unique property (Only one event can be to a name (both in events,deletedevents collections))
Getting all Years at a time
    --Sending Years data in descending order
Getting Events of a Specific Year using page loading
    --Sending Events to Events page (Only EventName,Main Logo, date is send ,not gallery images to reduce load)
Getting Images of Specific Event using Lazy Loading
    --Sending Images of an specific Event
Adding More pics to existing Event gallery
    --Adding More Pics to already existing Event
Delete an Event
    --Delete an event details in years, events collection
    --Adding that details in deletedevents collection for restore
Delete a specific pic of an Event 
    --Performed deletion of one selected pic(No restore)
Adding of Deleted Event to Event page
    -- Adding same details to events page
    --Retriving that id and stroing it in years collection
    --Removing it in deletedevents collection
*/
const express = require('express');
const multer = require('multer');
const { GridFSBucket, ObjectId } = require('mongodb');
const eventsApp = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

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

//Creating New Event
eventsApp.post('/create', upload.fields([
    { name: 'mainLogo', maxCount: 1 },
    { name: 'images', maxCount: 15 } ]), async (req, res) => {
    try {
        const eventsCollection = req.app.get('events');
        const deletedevents = req.app.get('deletedevents');
        const gridfsBucket = req.app.get('gridfsBucket');
        const yearsCollection = req.app.get('years'); 

        const { eventname, dateOfEvent } = req.body;

        const alreadyinserted = await eventsCollection.findOne({ eventname });
        const alreadydeleted = await deletedevents.findOne({ eventname });

        if (alreadyinserted)
             {
                 return res.status(401).send({ message: 'Event already exists' });
             }
         else if (alreadydeleted)
             {
                 return res.status(401).send({ message: 'Event name already exists in deleted events. Try changing the event name.' });
             }

        const newEvent = {
            eventname,
            dateOfEvent,
            mainLogoId: null,
            imagesIds: []
        };

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

        const result = await eventsCollection.insertOne(newEvent);
        const eventId = result.insertedId; 

        const eventYear = new Date(dateOfEvent).getFullYear();

        const year = await yearsCollection.findOne({ year: eventYear });

        if (year) 
            {
            await yearsCollection.updateOne(
                { year: eventYear },
                { $push: { events: eventId } }
            );
            } 
        else {
            await yearsCollection.insertOne({
                year: eventYear,
                events: [eventId]
            });
        }

        return res.status(201).send({ message: 'Event created successfully', event: newEvent });

    } 
    catch (error)
     {
        console.error('Error creating event:', error);
        return res.status(500).send({ message: 'Failed to create event', error: error.message });
     }
});

//Getting all Years at a time
eventsApp.get('/years', async (req, res) => {
    try {
        const yearsCollection = req.app.get('years');
        
        const yearsList = await yearsCollection.find().sort({ year: -1 }).toArray();

        if (yearsList.length === 0) {
            return res.status(404).send({ message: 'No years found' });
        }

        res.status(200).send({ message: 'Years retrieved successfully', payload: yearsList });
    } catch (error) {
        console.error('Error fetching years:', error);
        res.status(500).send({ message: 'Failed to retrieve years', error: error.message });
    }
});

//Getting Events of a Specific Year using page loading
eventsApp.get('/events/year/:year', async (req, res) => {
    try {
        const eventsCollection = req.app.get('events');
        const yearsCollection = req.app.get('years');
        const gridfsBucket = req.app.get('gridfsBucket');

        const skip = parseInt(req.query.skip);
        const limit = parseInt(req.query.limit);
        const year = parseInt(req.params.year, 10);
        
        const yearData = await yearsCollection.findOne({ year });

        const eventIds = yearData.events.map(id => new ObjectId(id));
        const eventsList = await eventsCollection.find({ _id: { $in: eventIds } })
        .skip(skip)
        .limit(limit)
        .toArray();

        const eventsWithMainLogo = await Promise.all(eventsList.map(async (event) => {
            const mainLogoData = event.mainLogoId ? await getImageDataById(event.mainLogoId, gridfsBucket) : null;

            return {
                eventname: event.eventname,
                dateOfEvent: event.dateOfEvent,
                mainLogoData: mainLogoData ? mainLogoData.toString('base64') : null,
            };
        }));
        res.status(200).send({ message: 'Events retrieved successfully', payload: eventsWithMainLogo });
    } catch (error) {
        console.error('Error fetching events by year:', error);
        res.status(500).send({ message: 'Failed to retrieve events by year', error: error.message });
    }
});

//Getting Images of Specific Event using Lazy Loading
eventsApp.get('/events/event/:eventname', async (req, res) => {
    try {

        const eventsCollection = req.app.get('events');
        const gridfsBucket = req.app.get('gridfsBucket'); 
        
        const eventname = req.params.eventname;
        
        const skip = parseInt(req.query.skip) || 0;
        const limit = parseInt(req.query.limit) || 10; 

        const event = await eventsCollection.findOne({ eventname });

        if (!event) {
            return res.status(404).send({ message: 'Event not found' });
        }

        const imageIds = event.imagesIds || [];

        if (imageIds.length === 0) {
            return res.status(200).send({ payload: [] }); 
        }

        const paginatedImageIds = imageIds.slice(skip, skip + limit);

        const getImageDataById = async (imageId, gridfsBucket) => {
            return new Promise((resolve, reject) => {

                const downloadStream = gridfsBucket.openDownloadStream(new ObjectId(imageId));
                
                let chunks = [];
                downloadStream.on('data', chunk => {
                    chunks.push(chunk);
                });
                downloadStream.on('end', () => {
                    const imageData = Buffer.concat(chunks); 
                    resolve(imageData);
                });
                downloadStream.on('error', err => {
                    reject(err);  
                });
            });
        };

        // Fetch images from GridFS
        const imagePromises = paginatedImageIds.map(async imageId => {
            try {
                const imageData = await getImageDataById(imageId, gridfsBucket);
                return `data:image/jpeg;base64,${imageData.toString('base64')}`;  // Return as base64
            } catch (error) {
                console.error(`Error fetching image ${imageId}:`, error);
                return null;  // Skip failed images
            }
        });

        const images = await Promise.all(imagePromises);

        // Filter out any null values (in case of errors)
        const filteredImages = images.filter(image => image !== null);

        // Send the response with the images
        res.status(200).send({ payload: filteredImages });
    } catch (error) {
        console.error('Error fetching event images:', error);
        res.status(500).send({ message: 'Failed to retrieve images', error: error.message });
    }
});



//Adding More pics to existing Event gallery
eventsApp.post('/events/:eventname/images', upload.array('images', 15), async (req, res) => {
    try {
        const eventsCollection = req.app.get('events');
        const gridfsBucket = req.app.get('gridfsBucket');
        const eventname = req.params.eventname;

        const event = await eventsCollection.findOne({ eventname });
        if (!event) {
            return res.status(404).send({ message: 'Event not found' });
        }

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

        const imageIds = await Promise.all(imageUploadPromises);

        await eventsCollection.updateOne(
            { eventname },
            { $push: { imagesIds: { $each: imageIds } } }
        );

        res.status(200).send({ message: 'Images uploaded successfully', payload: { images: imageIds } });
        
    }
     catch (error) 
     {
        console.error('Error uploading images:', error);
        res.status(500).send({ message: 'Failed to upload images', error: error.message });
    }
});

//Delete an Event
eventsApp.delete('/events', async (req, res) => {
    try {
        const eventName = decodeURIComponent(req.query.eventname);
        
        const eventsCollection = req.app.get('events');
        const deletedEventsCollection = req.app.get('deletedevents'); 
        const yearsCollection = req.app.get('years'); 

        const event = await eventsCollection.findOne({ eventname: eventName });
        if (!event) {
            return res.status(404).send({ message: 'Event not found' });
        }

        const eventId = event._id;
        const eventYear = new Date(event.dateOfEvent).getFullYear();

        await yearsCollection.updateOne(
            { year: eventYear },
            { $pull: { events: new ObjectId(eventId) } } 
        );

        const yearDoc = await yearsCollection.findOne({ year: eventYear });
        if (yearDoc && yearDoc.events.length === 0) {

            await yearsCollection.deleteOne({ year: eventYear });
            
        }
        const deletedEvent = {
            ...event,
            deletedBy: req.query.username, 
        };

        await deletedEventsCollection.insertOne(deletedEvent);

        await eventsCollection.deleteOne({ eventname: eventName });
       
        res.status(200).send({ message: 'Event deleted and logged successfully' });

    } catch (error) {

        res.status(500).send({ message: 'Failed to delete event', error: error.message });
    }
});

//Delete a specific pic of an Event 
eventsApp.delete('/events/:eventname/images/:index', async (req, res) => {
    try {
        const { eventname, index } = req.params;
        const eventsCollection = req.app.get('events');
        const gridfsBucket = req.app.get('gridfsBucket');

        // Find the event by eventname
        const event = await eventsCollection.findOne({ eventname });
        if (!event) {
            return res.status(404).send({ message: 'Event not found' });
        }

        // Convert the index to an integer
        const imageIndex = parseInt(index, 10);

        // Check if the image index is valid
        if (isNaN(imageIndex) || imageIndex < 0 || imageIndex >= event.imagesIds.length) {
            return res.status(400).send({ message: 'Invalid image index' });
        }

        const imageId = event.imagesIds[imageIndex];
        
        // Validate the image ID
        if (!ObjectId.isValid(imageId)) {
            return res.status(400).send({ message: 'Invalid image ID' });
        }

        // Delete the image from GridFS using the imageId
        await gridfsBucket.delete(new ObjectId(imageId));

        // Remove the image ID from the imagesIds array in the event document
        await eventsCollection.updateOne(
            { eventname },
            { $pull: { imagesIds: imageId } }
        );

        res.status(200).send({ message: 'Image deleted successfully' });
    } 
    catch (error) {
        console.error('Error deleting image:', error);
        res.status(500).send({ message: 'Failed to delete image', error: error.message });
    }
});

eventsApp.get('/deleted-events', async (req, res) => {
    try {
        const deletedEventsCollection = req.app.get('deletedevents');

        // Retrieve all deleted events from the collection
        const deletedEvents = await deletedEventsCollection.find().toArray();

        if (deletedEvents.length === 0) {
            return res.status(404).send({ message: 'No deleted events found' });
        }

        res.status(200).send({
            message: 'Deleted events retrieved successfully',
            payload: deletedEvents
        });
    } catch (error) {
        console.error('Error fetching deleted events:', error);
        res.status(500).send({ message: 'Failed to retrieve deleted events', error: error.message });
    }
});

// Adding of Deleted Event to Event page
eventsApp.post('/events/restore', async (req, res) => {
    try {
        const eventName = req.body.eventname; // Event name to be restored
        
        const eventsCollection = req.app.get('events');
        const deletedEventsCollection = req.app.get('deletedevents');
        const yearsCollection = req.app.get('years');

        // Find the event in the deleted events collection
        const deletedEvent = await deletedEventsCollection.findOne({ eventname: eventName });
        if (!deletedEvent) {
            return res.status(404).send({ message: 'Deleted event not found' });
        }

        // Restore the event details to the events collection
        const restoredEvent = {
            eventname: deletedEvent.eventname,
            dateOfEvent: deletedEvent.dateOfEvent,
            mainLogoId: deletedEvent.mainLogoId,
            imagesIds: deletedEvent.imagesIds,
        };

        const result = await eventsCollection.insertOne(restoredEvent);
        const restoredEventId = result.insertedId;

        // Get the year from the event date
        const eventYear = new Date(deletedEvent.dateOfEvent).getFullYear();

        // Check if the year exists in the years collection
        const yearRecord = await yearsCollection.findOne({ year: eventYear });
        
        if (yearRecord) {
            // If the year exists, add the event to the events array
            await yearsCollection.updateOne(
                { year: eventYear },
                { $push: { events: restoredEventId } }
            );
        } else {
            // If the year does not exist, insert a new year record with the event
            await yearsCollection.insertOne({
                year: eventYear,
                events: [restoredEventId]
            });
        }

        // Remove the event from the deleted events collection
        await deletedEventsCollection.deleteOne({ eventname: eventName });

        // Respond with success
        res.status(200).send({
            message: 'Event restored successfully',
            restoredEvent: restoredEvent,
        });
    } catch (error) {
        console.error('Error restoring event:', error);
        res.status(500).send({ message: 'Failed to restore event', error: error.message });
    }
});

module.exports = eventsApp;
