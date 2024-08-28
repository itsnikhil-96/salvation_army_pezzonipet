const exp=require('express');
require('dotenv').config();
const usersApp = exp.Router();
const bcryptjs=require('bcryptjs')
const jwt=require('jsonwebtoken')
const tokenVerify=require('../middlewares/tokenVerify.js')
const expressAsyncHandler=require('express-async-handler')

usersApp.use(exp.json());

//displaying all users


usersApp.get("/user-api/user", expressAsyncHandler(async (req, res) => {
  // Extract username and password from query parameters
  const { username, password } = req.query;
  console.log("Received username:", username, "and password:", password); // Logging

  // Get usersCollection obj
  const usersCollection = req.app.get("users");
  
  // Find user by username and password
  let user = await usersCollection.findOne({ username, password });
  console.log("Found user:", user); // Logging
  
  if (user) {
    // If user is found, send user object
    res.send(user);
  } else {
    // If user is not found, send error message
    res.status(401).send({ message: "Invalid Username or Password" });
  }
}));


//adding the user

usersApp.post("/user", expressAsyncHandler(async(req, res) => {

    //get usersCollection obj
    const usersCollection = req.app.get("users");
    
    //get new User from client
    const newUser=req.body;
  
     //verify duplicate user
     let existingUser=await usersCollection.findOne({username:newUser.username})
     //if user already existed
     if(existingUser!==null){
       res.send({message:"User already existed"})
     }
     //if user not existed
     else{
       //hash the password
       let hashedpassword= await bcryptjs.hash(newUser.password,7)
       //replace plain password with hashed password in newUser
       newUser.password=hashedpassword;
       newUser.confirmPassword=hashedpassword;
       newUser.deletedevents = [];
       //save user
       await usersCollection.insertOne(newUser)
       //send res
       res.send({message:"user created"})
     }
  }));

  usersApp.post('/login', expressAsyncHandler(async (req, res) => {
    // get usersCollection obj
    const usersCollection = req.app.get("users");
    // get new UserCredentials from client
    const userCred = req.body;
  
    // verify username
    let dbUser = await usersCollection.findOne({ username: userCred.username });
  
    // if user not existed
    if (dbUser === null) {
      return res.status(401).send({ message: "Invalid username" });
    }
  
    // if user found, compare passwords
    let result = await bcryptjs.compare(userCred.password, dbUser.password);
    
    // if passwords not matched
    if (result === false) {
      return res.status(401).send({ message: "Invalid password" });
    }
  
    // if passwords are matched
    // create JWT token
    let signedToken = jwt.sign({ username: userCred.username }, process.env.SECRET_KEY, { expiresIn: '1h' });
  
    // send response
    res.send({ message: "Login success", token: signedToken, user: dbUser,payload:dbUser});
  }));

  // Add this route to your user API
usersApp.post("/adddeletedevent", expressAsyncHandler(async (req, res) => {
  const{ username,eventDetails } = req.body;
  const usersCollection = req.app.get("users");
  try {
    const result = await usersCollection.updateOne(
      { username },
      { $push: { deletedevents: eventDetails } }
    );

    if (result.modifiedCount > 0) {
      res.status(200).send({ message: "Event added to deletedevents" });
    } else {
      res.status(400).send({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).send({ message: "Server error" });
  }
}));

module.exports = usersApp;