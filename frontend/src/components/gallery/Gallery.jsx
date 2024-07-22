import React from 'react';
import { useParams } from 'react-router-dom';
import './Gallery.css';

function Gallery() {
  const { eventName } = useParams();
  
  

  return (
    <div className="gallery">
      <h1>{eventName}</h1>
      
    </div>
  );
}

export default Gallery;
