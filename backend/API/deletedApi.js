const express = require('express');
const multer = require('multer');
const { ObjectId } = require('mongodb');
const deletedApp = express.Router();


deletedApp.post("/delete", async (req, res) => {
    try {
        const { eventname, username } = req.body;

        if (!eventname || !username) {
            return res.status(400).send({ message: "Event name and username are required" });
        }
        const deletedEventsCollection = req.app.get('deletedEvents'); 

        const deletionDetails = {
            eventname,
            username
        };

        await deletedEventsCollection.insertOne(deletionDetails);

        res.status(200).send({ message: "Details are entered successfully" });
    } catch (error) {
        console.error("Something went wrong:", error);
        res.status(500).send({ message: "Failed to update deleted event", error: error.message });
    }
});

module.exports = deletedApp;
