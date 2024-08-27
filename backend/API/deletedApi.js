const express = require('express');
const multer = require('multer');
const { ObjectId } = require('mongodb');
const deletedApp = express.Router();


deletedApp.post("/events/:eventname", (async (req, res) => {
    try {
        const eventName = req.params.eventname;
        const eventsCollection = req.app.get('events');

        const deletionResult = await eventsCollection.findOne({ eventname: eventName });

        if (deletionResult.deletedCount === 0) {
            return res.status(404).send({ message: "Event not found" });
        }

        res.status(200).send({ message: "Event deleted successfully" });
    } catch (error) {
        console.error("Error deleting event:", error);
        res.status(500).send({ message: "Failed to delete event", error: error.message });
    }
}));

module.exports = deletedApp;
