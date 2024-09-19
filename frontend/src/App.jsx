import React from "react";
import { createBrowserRouter, RouterProvider, Routes, Route } from 'react-router-dom';
import RootLayout from "./RootLayout";
import AboutUs from './components/aboutus/AboutUs';
import Doctrines from './components/doctrines/Doctrines';
import Officers from './components/officers/Officers';
import Login from "./components/login/Login";
import Register from "./components/register/Register";
import Gallery from "./components/gallery/Gallery";
import AddEvent from "./components/addevent/AddEvent";
import Events from "./components/events/Events";
import Home1 from "./components/home1/Home1";
import DeletedEvents from "./components/deletedevents/DeletedEvents";
function App() {
  const browserRouter = createBrowserRouter([
    {
      path: "",
      element: <RootLayout />,
      children: [
        { path: "", 
          element: <Home1 /> 
        },
        {
           path: "home", 
          element: <Home1 />
         },
        {
           path: "aboutus",
           element: <AboutUs />
           },
        { 
          path: "doctrines", 
          element: <Doctrines />
         },
        {
           path: "officers",
            element: <Officers /> 
          },
         {
          path:"events",
          element :<Events/>
         },
        {
           path: "login", 
           element: <Login /> 
          },
        {
           path: "register",
            element: <Register />
           },
        { 
          path: "gallery", 
          element: <Gallery />
         },
        { 
          path: "gallery/:eventname",
           element: <Gallery />
        },
        {
          path :"deletedevents",
          element:<DeletedEvents/>
        },
        {
          path:"addevent",
          element:<AddEvent/>
        }
       
      ]
    }
  ]);

  return (
    <div className="main">
      <RouterProvider router={browserRouter} />
    </div>
  );
}

export default App;
