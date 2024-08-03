const exp = require("express");
require('dotenv').config();
const eventApp = exp.Router();
const bcryptjs=require('bcryptjs')
const jwt=require('jsonwebtoken')
const tokenVerify=require('../middlewares/tokenVerify.js')
const expressAsyncHandler=require('express-async-handler');

eventApp.use(exp.json());

//route to print all events
eventApp.get("/events",expressAsyncHandler(async (req, res) => {

    //get events obj
    const events = req.app.get("events");
    
    let eventsList = await events.find().toArray();

    res.send({ message: "events", payload: eventsList });
  }));


//route to create Event
eventApp.post("/events", expressAsyncHandler(async(req, res) =>
 {

  //get usersCollection obj
  const events = req.app.get("events");

  //get new Event from client
  const newEvent=req.body;
  
  //verify duplicate event
   let existingEvent = await events.findOne({eventname:newEvent.eventname})

   //if event already existed
   if(existingEvent!==null){
     res.send({message:"event already existed"})
   }
   //if event not existed
   else{
    
     await events.insertOne(newEvent)
     //send res
     res.send({message:"event created"})
   }
}));

//adding pics to already existing event

eventApp.post("/events/", expressAsyncHandler(async (req, res) => {
    // Get events collection object
    const events = req.app.get("events");

    // Get new events from client (array of images)
    const newEvents = req.body.events;

    // Get event name from URL
    const eventName = req.body.eventname;

    let existingEvent = await events.findOne({eventname:eventName})
    if(existingEvent==null)
    {
      res.send({message:"Event name alrrady Exists"})
    }

    // Initialize an array to store messages
    const responseMessages = [];

    for (const newEvent of newEvents) {
        // Checking event already exists
        let existingEvent = await events.findOne({ eventname: eventName, events: newEvent });

        // If the event exists, add a message
        if (existingEvent != null) {
            responseMessages.push({ event: newEvent, message: "already exists" });
        }
        // If the event does not exist, add it
        else {
            await events.updateOne({ eventname: eventName }, { $push: { events: newEvent } });
            responseMessages.push({ event: newEvent, message: "added successfully" });
        }
    }

    // Send response with all messages
    res.send(responseMessages);
}));



//deleting an event 
eventApp.delete("/events/:eventname",expressAsyncHandler(async(req,res)=>
{
    //get events obj
    const events = req.app.get("events");

    //get eventname form url
    const eventName=req.params.eventname;

    //delete user
    events.deleteOne({eventname:eventName})
     
    //sending response
    res.send({message:"event deleted successfully"});

}))

module.exports = eventApp;
 