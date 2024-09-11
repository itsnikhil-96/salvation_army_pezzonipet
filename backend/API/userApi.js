const exp=require('express');
require('dotenv').config();
const usersApp = exp.Router();
const bcryptjs=require('bcryptjs')
const expressAsyncHandler=require('express-async-handler')

usersApp.use(exp.json());

usersApp.get("/user-api/user", expressAsyncHandler(async (req, res) => {

  const { username, password } = req.query;

  const usersCollection = req.app.get("users");
  
  let user = await usersCollection.findOne({ username, password });
  
  if (user)
     {
    res.send(user);
    }
   else 
   {
    res.status(401).send({ message: "Invalid Username or Password" });
   }
}));


usersApp.post("/user", expressAsyncHandler(async(req, res) => {

    const usersCollection = req.app.get("users");
    
    const newUser=req.body;
  
     let existingUser=await usersCollection.findOne({username:newUser.username})

     if(existingUser!==null){
       res.send({message:"User already existed"})
     }

     else{

      let hashedpassword= await bcryptjs.hash(newUser.password,7)

       newUser.password=hashedpassword;
       newUser.confirmPassword=hashedpassword;
       
       await usersCollection.insertOne(newUser)

       res.send({message:"user created"})
     }
  }));

  usersApp.post('/login', expressAsyncHandler(async (req, res) => {

    const usersCollection = req.app.get("users");

    const userCred = req.body;
  
    let dbUser = await usersCollection.findOne({ username: userCred.username });
  
    if (dbUser === null) {
      return res.status(401).send({ message: "Invalid username" });
    }
  
    let result = await bcryptjs.compare(userCred.password, dbUser.password);
    
    if (result === false) {
      return res.status(401).send({ message: "Invalid password" });
    }
  
   
    res.send({ message: "Login success", user: dbUser,payload:dbUser});
  }));

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