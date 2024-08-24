import React from "react";
import { createBrowserRouter, RouterProvider, Routes, Route } from 'react-router-dom';
import RootLayout from "./RootLayout";
import Home from './components/home/Home';
import AboutUs from './components/aboutus/AboutUs';
import Doctrines from './components/doctrines/Doctrines';
import Officers from './components/officers/Officers';
import Login from "./components/login/Login";
import Register from "./components/register/Register";
import Gallery from "./components/gallery/Gallery";
import EditProfile from "./components/editprofile/EditProfile";
import AddEvent from "./components/addevent/AddEvent";
import PhotoGallery from "./components/photogallery/PhotoGallery";
import Events from "./components/events/Events";
import Home1 from "./components/home1/Home1";
import AddEvent1 from "./components/addevent/AddEvent1";

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
          path :"editprofile",
          element:<EditProfile/>
        },
        {
          path:"addevent",
          element:<AddEvent/>
        },
        {
          path:"photogallery",
          element:<PhotoGallery/>
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
