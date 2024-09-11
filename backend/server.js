const express = require('express');
const cors = require('cors');
require('dotenv').config();  

const app = express();

app.use(cors({
  origin: 'https://salvation-army-pezzonipet-cyf5.vercel.app' 
}));

app.use(express.json());

const { MongoClient, GridFSBucket } = require("mongodb");
const mClient = new MongoClient(process.env.DB_URL);

mClient.connect()
  .then((connectionObj) => {
    const database = connectionObj.db('salvationarmy');

    app.set('events', database.collection('events'));
    app.set('users', database.collection('users'));
    app.set('years',database.collection('years'));
    app.set('deletedevents', database.collection('deletedevents'));

    const gridfsBucket = new GridFSBucket(database, {
      bucketName: 'images'  
    });

    app.set('gridfsBucket', gridfsBucket);

    const eventsApp = require("./API/eventsApi");
    const usersApp = require("./API/userApi");

    app.use("/event-api", eventsApp);
    app.use("/user-api", usersApp);

    app.use('*', (req, res) => {
      console.log(`Invalid path: ${req.path}`);
      res.status(404).send({ message: 'Invalid path' });
    });

    app.use((err, req, res, next) => {
      console.error("Error occurred:", err);  // Log the error
      res.status(500).send({ message: "An error occurred", errorMessage: err.message });
    });

    const PORT = process.env.PORT;
    app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
  })
  .catch((err) => {
    console.error("Database connection failed:", err.message);
  });
