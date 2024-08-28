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
        const deletedEventsCollection = req.app.get('deletedevents'); 
        const result = await deletedEventsCollection.insertOne({
            eventname,
            username
         });

        if (result.insertedCount === 1) {
            res.status(200).send({ message: "Details logged successfully" });
        } else {
            res.status(500).send({ message: "Failed to log deletion details" });
        }
    } catch (error) {
        console.error("Error logging deletion details:", error);
        res.status(500).send({ message: "Failed to log deletion details", error: error.message });
    }
});

module.exports = deletedApp;
