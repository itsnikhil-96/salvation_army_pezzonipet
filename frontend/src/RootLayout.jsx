import React from 'react';
import Header3 from "./components/header1/Header1";
import Footer from "./components/footer/Footer";
import { Outlet } from "react-router-dom";
import './Rootlayout.css';

function RootLayout() 
{
  return (
    <div className="root-layout">
      <div className='headerroot'><Header3/></div>
      <div className="container outlet">
        <Outlet />
      </div>
     
     <div className='footerroot'><Footer/></div>
    </div>
  );
}

export default RootLayout;
