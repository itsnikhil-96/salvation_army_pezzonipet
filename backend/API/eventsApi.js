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
eventApp.put("/events/:eventname",expressAsyncHandler(async(req,res)=>
{
      //get usersCollection obj
      const events = req.app.get("events");

      //get new Event from client
      const newEvent=req.body.events;
      
      //checking if that pic is already existed
      let existingEvent = await events.findOne({events:newEvent})

      //if existed
      if(existingEvent!=null)
      {
        res.send({message:"already that pic is existed"})
      }

      //if not existed
      else
      {
      //get username form url
      const eventName=req.params.eventname;
      
      //add event
      let result=await events.updateOne({eventname:eventName},{$push:{events:newEvent}})

      //sending response
      res.send({message:"event added successfully"})
      }
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
 