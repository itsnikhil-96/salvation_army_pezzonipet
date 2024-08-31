const express = require('express');
const multer = require('multer');
const eventsApp = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Create a new event
eventsApp.post('/create', upload.fields([{ name: 'mainLogo', maxCount: 1 }, { name: 'images' }]), async (req, res) => {
    try {
        const eventsCollection = req.app.get('events');
        const deletedevents= req.app.get('deletedevents');
        const { eventname, dateOfEvent } = req.body;
        const mainLogo = req.files['mainLogo'] ? req.files['mainLogo'][0].buffer : null;
        const images = req.files['images'] ? req.files['images'].map(file => file.buffer) : [];

        const newEvent = {
            eventname,
            dateOfEvent,
            mainLogo,
            images,
        };
        const alreadyinserted = await eventsCollection.findOne({ eventname });
        const alreadydeleted = await deletedevents.findOne({eventname});
        if(alreadyinserted)
        {
            res.status(401).send({ message: 'Event already Existed' });
        }
        else if(alreadydeleted)
        {
            res.status(401).send({ message: 'Eventname already Existed in deletedevents for restore.Try to change eventname' });
        }
        else
        {
        await eventsCollection.insertOne(newEvent);
        res.status(201).send({ message: 'Event created successfully', event: newEvent });
        }
    } catch (error) {
        console.error('Error creating event:', error);
        res.status(500).send({ message: 'Failed to create event', error: error.message });
    }
});

// Get all events
eventsApp.get('/events', async (req, res) => {
    try {
        const eventsCollection = req.app.get('events');
        const eventsList = await eventsCollection.find().maxTimeMS(6000000000000000000000000000000000).toArray();
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
