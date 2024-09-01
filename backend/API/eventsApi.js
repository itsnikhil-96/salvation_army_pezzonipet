const express = require('express');
const multer = require('multer');
const eventsApp = express.Router();

// Use memory storage for uploaded files
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Create a new event
eventsApp.post('/create', upload.fields([
    { name: 'mainLogo', maxCount: 1 },
    { name: 'images', maxCount: 100 } // Allow up to 100 images
]), async (req, res) => {
    try {
        const eventsCollection = req.app.get('events');
        const deletedevents = req.app.get('deletedevents');
        const { eventname, dateOfEvent } = req.body;

        // Handling the uploaded files
        const mainLogo = req.files['mainLogo'] ? req.files['mainLogo'][0].buffer : null;
        const images = req.files['images'] ? req.files['images'].map(file => file.buffer) : [];

        // Check if the event already exists in the collection or deleted events
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
            mainLogo,
            images,
        };

        // Insert the new event into the database
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
        const skip = parseInt(req.query.skip) || 0;
        const limit = parseInt(req.query.limit) || 1; // Default to 10 if no limit is specified

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

// Delete an event by eventname
eventsApp.delete('/events', async (req, res) => {
    try {
        const eventName = decodeURIComponent(req.query.eventname);
        const eventsCollection = req.app.get('events');
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
