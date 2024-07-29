
const exp = require('express');
const app = exp();

const cors = require('cors');

// Configuring CORS
app.use(cors({
  origin: "http://localhost:5173"
}));

// Loading environment variables
require('dotenv').config();

// Import MongoClient
const { MongoClient } = require("mongodb");

// Create MongoClient object
let mClient = new MongoClient(`mongodb://127.0.0.1:27017/`);

// Middleware for parsing JSON bodies
app.use(exp.json());

mClient.connect()
  .then((connectionObj) => {
    // Connecting to salvation army database
    const database = connectionObj.db('salvationarmy');
    
    // Connecting to events collection
    const events = database.collection('events');

    app.set('events',events);

    console.log('Database connection successful');

    // Import eventApp express object
    const eventApp = require("./API/eventsApi");

    // Use eventApp for /event-api route
    app.use("/event-api", eventApp);

    app.use('*',(req,res,next)=>{
      console.log(req.path)
      res.send({message:`Invalid path`})
    })

    // Error handling middleware
    app.use((err, req, res, next) => {
      res.status(500).send({ message: "Error occurred", errorMessage: err.message });
    });

    // Assigning port number
    app.listen(5000, () => console.log("Server running on port 5000"));
  })
  .catch(err => {
    console.error("Failed to connect to the database", err);
  });
