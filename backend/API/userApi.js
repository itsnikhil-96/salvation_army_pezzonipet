const exp=require('express');
require('dotenv').config();
const userApp = exp.Router();
const bcryptjs=require('bcryptjs')
const jwt=require('jsonwebtoken')
const tokenVerify=require('../middlewares/tokenVerify.js')
const expressAsyncHandler=require('express-async-handler')

userApp.use(exp.json());

//displaying all users

userApp.get("/users",expressAsyncHandler(async (req, res) => {

    //get usersCollection obj
    const usersCollection = req.app.get("users");

    //get users data from usersCollection of DB
    let usersList = await usersCollection.find().toArray();

    //send users data to client
    res.send({ message: "users", payload: usersList });
  }));

//adding the user

userApp.post("/user", expressAsyncHandler(async(req, res) => {

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
       //save user
       await usersCollection.insertOne(newUser)
       //send res
       res.send({message:"user created"})
     }
  }));

  userApp.post('/login', expressAsyncHandler(async (req, res) => {
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
module.exports = userApp;