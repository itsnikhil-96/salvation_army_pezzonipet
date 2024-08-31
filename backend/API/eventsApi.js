const express = require('express');
const multer = require('multer');
const eventsApp = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ 
    storage: storage,
    limits: { fileSize: 100 * 1024 * 1024 } // Limit file size to 10MB
});


// Create a new event
eventsApp.post('/create', upload.fields([{ name: 'mainLogo', maxCount: 1 }, { name: 'images' }]), async (req, res) => {
    try {
        const eventsCollection = req.app.get('events');
        const deletedevents= req.app.get('deletedevents');
        const { eventname, dateOfEvent } = req.body;
        const mainLogo = req.files['mainLogo'] ? req.files['mainLogo'][0].buffer : null;
        const images = req.files['images'] ? req.files['images'].map(file => file.buffer) : [];

        // Check if the event already exists in either collection
        const alreadyinserted = await eventsCollection.findOne({ eventname });
        const alreadydeleted = await deletedevents.findOne({eventname});
        
        if(alreadyinserted) {
            return res.status(401).send({ message: 'Event already Existed' });
        } else if(alreadydeleted) {
            return res.status(401).send({ message: 'Eventname already Existed in deletedevents for restore. Try to change eventname' });
        }

        // Create the new event object, but do not insert it yet
        const newEvent = {
            eventname,
            dateOfEvent,
            mainLogo,
            images,
        };

        // Attempt to insert the new event into the database only after all images are processed
        await eventsCollection.insertOne(newEvent);
        return res.status(201).send({ message: 'Event created successfully', event: newEvent });
        
    } catch (error) {
        console.error('Error creating event:', error);
        return res.status(500).send({ message: 'Failed to create event', error: error.message });
    }
});


// Get all events
eventsApp.get('/events', async (req, res) => {
    try {
        const eventsCollection = req.app.get('events');
        
        const skip = parseInt(req.query.skip) || 0; 
        const limit = parseInt(req.query.limit) || 1; 

        // Fetch the events with pagination
        const eventsList = await eventsCollection.find()
            .skip(skip)
            .limit(limit)
            .toArray();

        res.status(200).send({ message: 'Events retrieved successfully', payload: eventsList });
    } catch (error) {
        console.error('Error fetching events:', error);
        res.status(500).send({ message: 'Failed to retrieve events', error: error.message });
    }
});

// Get a single event by eventname
eventsApp.get('/events/:eventname', async (req, res) => {
    try {
        const eventsCollection = req.app.get('events');
        const eventname = req.params.eventname;
        const event = await eventsCollection.findOne({ eventname });

        if (!event) {
            return res.status(404).send({ message: 'Event not found' });
        }

        res.status(200).send({ message: 'Event retrieved successfully', payload: event });
    } catch (error) {
        console.error('Error fetching event:', error);
        res.status(500).send({ message: 'Failed to retrieve event', error: error.message });
    }
});

// Add a unique ID to your event schema
eventsApp.delete("/events", async (req, res) => {
    try {
        const eventName = decodeURIComponent(req.query.eventname);
        const eventsCollection = req.app.get('events');
        const deletionResult = await eventsCollection.deleteOne({ eventname: eventName });

        if (deletionResult.deletedCount === 0) {
            return res.status(404).send({ message: "Event not found" });
        }

        res.status(200).send({ message: "Event deleted successfully" });
    } catch (error) {
        console.error("Error deleting event:", error);
        res.status(500).send({ message: "Failed to delete event", error: error.message });
    }
});





module.exports = eventsApp;
