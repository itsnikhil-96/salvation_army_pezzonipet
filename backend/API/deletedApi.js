const express = require('express');
const multer = require('multer');
const deletedApp = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Define the delete route
deletedApp.post("/delete", upload.fields([{ name: 'mainLogo', maxCount: 1 }, { name: 'images' }]), async (req, res) => {
    try {
        const deletedCollection = req.app.get('deletedevents'); // Access the deleted collection from the app context
        const { eventname, dateOfEvent } = req.body;

        // Check if files are present and extract their buffers
        const mainLogo = req.files && req.files['mainLogo'] ? req.files['mainLogo'][0].buffer : null;
        const images = req.files && req.files['images'] ? req.files['images'].map(file => file.buffer) : [];

        // Log the uploaded files for debugging purposes

        const newEvent = {
            eventname,
            dateOfEvent,
            mainLogo,
            images,
        };

        // Check if the event is already in the deleted collection
        const alreadyDeleted = await deletedCollection.findOne({ eventname, dateOfEvent });
        if (alreadyDeleted) {
            return res.status(409).send({ message: "Event already present in deleted collection" });
        }

        // Insert the event into the deleted collection
        await deletedCollection.insertOne(newEvent);
        res.status(201).send({ message: 'Event restored successfully in database', event: newEvent });

    } catch (error) {
        res.status(500).send({ message: "Failed to log deletion", error: error.message });
    }
});

module.exports = deletedApp;
