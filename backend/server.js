const express = require('express');
const cors = require('cors');
require('dotenv').config();  // Load environment variables from .env file

const app = express();

// Use CORS to allow requests from the frontend
app.use(cors({
  origin: 'https://salvation-army-pezzonipet-cyf5.vercel.app'  // Update this if your frontend is hosted elsewhere
}));

// Middleware to parse JSON
app.use(express.json());

// Import MongoClient and GridFSBucket from MongoDB
const { MongoClient, GridFSBucket } = require("mongodb");
const mClient = new MongoClient(process.env.DB_URL);

mClient.connect()
  .then((connectionObj) => {
    const database = connectionObj.db('salvationarmy');

    // Set collections
    app.set('events', database.collection('events'));
    app.set('users', database.collection('users'));
    app.set('years',database.collection('years'));
    app.set('deletedevents', database.collection('deletedevents'));

    // Create a new GridFS bucket for file storage
    const gridfsBucket = new GridFSBucket(database, {
      bucketName: 'images'  // You can change the bucket name if you want
    });

    // Set the GridFS bucket in the app instance
    app.set('gridfsBucket', gridfsBucket);

    // Import and use eventApp and userApp express routers
    const eventsApp = require("./API/eventsApi");
    const usersApp = require("./API/userApi");
    const deletedApp = require("./API/deletedApi");

    app.use("/event-api", eventsApp);
    app.use("/user-api", usersApp);
    app.use("/deleted-api", deletedApp);

    // Handle invalid paths
    app.use('*', (req, res) => {
      console.log(`Invalid path: ${req.path}`);
      res.status(404).send({ message: 'Invalid path' });
    });

    // Error handling middleware
    app.use((err, req, res, next) => {
      console.error("Error occurred:", err);  // Log the error
      res.status(500).send({ message: "An error occurred", errorMessage: err.message });
    });

    // Start the server on the specified port
    const PORT = process.env.PORT;
    app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
  })
  .catch((err) => {
    console.error("Database connection failed:", err.message);
  });
