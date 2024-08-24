const express = require('express');
const eventsApp = express.Router();
const multer = require('multer');
const expressAsyncHandler = require('express-async-handler');

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Route to get all events
eventsApp.get("/events", expressAsyncHandler(async (req, res) => {
    try {
        const eventsCollection = req.app.get('events');
        const eventsList = await eventsCollection.find().toArray(); // Fetch all events
        res.status(200).send({ message: "Events retrieved successfully", payload: eventsList });
    } catch (error) {
        console.error("Error fetching events:", error);
        res.status(500).send({ message: "Failed to retrieve events", error: error.message });
    }
}));

// Route to create a new event
eventsApp.post(
    "/create", 
    upload.fields([{ name: 'mainLogo', maxCount: 1 }, { name: 'images' }]), 
    expressAsyncHandler(async (req, res) => {
        try {
            const { eventname, dateOfEvent } = req.body;
            const mainLogo = req.files['mainLogo'] ? req.files['mainLogo'][0] : null;
            const images = req.files['images'] || [];

            if (!eventname || !dateOfEvent || !mainLogo || images.length === 0) {
                return res.status(400).send({ message: 'Event name, date of event, main logo, and images are required' });
            }

            const eventsCollection = req.app.get('events');

            // Check if the event already exists
            let existingEvent = await eventsCollection.findOne({ eventname });
            if (existingEvent) {
                return res.status(400).send({ message: "Event already exists" });
            }

            // Convert main logo and images to Base64
            const mainLogoBase64 = mainLogo.buffer.toString('base64');
            const imagesBase64 = images.map(image => image.buffer.toString('base64'));

            // Create a new event document
            const newEvent = {
                eventname: eventname,
                dateOfEvent: new Date(dateOfEvent),
                mainLogo: mainLogoBase64,
                images: imagesBase64,
            };

            // Insert the event into the database
            await eventsCollection.insertOne(newEvent);

            res.status(201).send({ message: "Event created successfully", event: newEvent });
        } catch (error) {
            console.error("Error creating event:", error);
            res.status(500).send({ message: "Failed to create event", error: error.message });
        }
    })
);

module.exports = eventsApp;
