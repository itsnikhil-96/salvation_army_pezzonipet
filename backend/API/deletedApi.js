const express = require('express');
const multer = require('multer');
const { ObjectId } = require('mongodb');

const deletedApp = express.Router();
const storage = multer.memoryStorage(); // Use memory storage to buffer files in memory
const upload = multer({ storage: storage }); // Configure multer for file upload

// Define the delete route
deletedApp.post("/delete", upload.fields([{ name: 'mainLogo', maxCount: 1 }, { name: 'images' }]), async (req, res) => {
    const deletedCollection = req.app.get('deletedevents'); // Access deleted events collection
    const gridfsBucket = req.app.get('gridfsBucket'); // Access GridFS bucket for file storage

    try {
        const { eventname, dateOfEvent, username } = req.body;

        // Check if event has already been deleted
        const alreadyDeleted = await deletedCollection.findOne({ eventname, dateOfEvent });
        if (alreadyDeleted) {
            return res.status(409).send({ message: "Event already present in deleted collection" });
        }

        // Store the main logo in GridFS
        let mainLogoId = null;
            mainLogoId = req.files['mainLogoId'][0]; // Store the ID of the uploaded logo

        // Store the images in GridFS and save their IDs
        const imageIds = [];
        if (req.files && req.files['images']) {
            for (const image of req.files['images']) {
                imageIds.push(image); // Store the ID of each image
            }
        }

        // Insert the event metadata and file references into the deleted collection
        const newEvent = {
            eventname,
            dateOfEvent,
            username,
            mainLogoId,
            imageIds
        };

        await deletedCollection.insertOne(newEvent);

        res.status(201).send({ message: 'Event stored in deleted collection', event: newEvent });
    } catch (error) {
        console.error('Error deleting event:', error);
        res.status(500).send({ message: "Failed to log deletion", error: error.message });
    }
});

module.exports = deletedApp;
