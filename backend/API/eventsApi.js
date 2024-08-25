const express = require('express');
const multer = require('multer');
const { ObjectId } = require('mongodb');
const eventsApp = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Create a new event
eventsApp.post('/create', upload.fields([{ name: 'mainLogo', maxCount: 1 }, { name: 'images' }]), async (req, res) => {
    try {
        const eventsCollection = req.app.get('events');

        const { eventname, dateOfEvent } = req.body;
        const mainLogo = req.files['mainLogo'] ? req.files['mainLogo'][0].buffer : null;
        const images = req.files['images'] ? req.files['images'].map(file => file.buffer) : [];

        const newEvent = {
            eventname,
            dateOfEvent,
            mainLogo,
            images,
        };

        await eventsCollection.insertOne(newEvent);

        res.status(201).send({ message: 'Event created successfully', event: newEvent });
    } catch (error) {
        console.error('Error creating event:', error);
        res.status(500).send({ message: 'Failed to create event', error: error.message });
    }
});

// Get all events
eventsApp.get('/events', async (req, res) => {
    try {
        const eventsCollection = req.app.get('events');
        const eventsList = await eventsCollection.find().toArray();

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

module.exports = eventsApp;
