import { userLoginContext } from "./userLoginContext";
import { useState } from "react";

function UserLoginStore({ children }) {
  //login user state
  let [currentUser, setCurrentUser] = useState(null);
  let [userLoginStatus, setUserLoginStatus] = useState(false);
  let [err, setErr] = useState("");

  //user login
  // UserLoginStore.jsx

async function loginUser(userCred) {
  console.log("Attempting to log in with credentials:", userCred);
  try {
    let res = await fetch('http://localhost:5000/user-api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userCred),
    });
    
    if (!res.ok) {
      throw new Error('Invalid Username or Password');
    }

    let data = await res.json();
    console.log("Response from server:", data);

    setCurrentUser(data.payload);
    setUserLoginStatus(true);
    setErr('');
  } 
  catch (error)
   {
    console.error("Login failed:", error.message);
    setErr(error.message);
    setUserLoginStatus(false);
    setCurrentUser(null);
  }
}


  //user logout
  function logoutUser() {
    //reset state
    setCurrentUser({});
    setUserLoginStatus(false);
    setErr('');
  }

  return (
    <userLoginContext.Provider
      value={{ loginUser, logoutUser, userLoginStatus, err, currentUser, setCurrentUser }}
    >
      {children}
    </userLoginContext.Provider>
  );
}

export default UserLoginStore;
