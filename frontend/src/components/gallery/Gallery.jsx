import React from 'react';
import { useParams } from 'react-router-dom';
import eventsData from '../eventsData';
import './Gallery.css'
function Gallery() {
  const { eventname } = useParams();
  const event = eventsData.find(event => event.eventname === eventname);

  if (!event) {
      return <div className="container mt-5"><h2>Event not found</h2></div>;
  }

  return (
      <div className="container mt-5">
          <h1 className="text-center mb-3">{event.eventname} Gallery</h1>
          <div className="row">
              {event.images.map((image, index) => (
                  <div key={index} className=" col-lg-2 col-md-3 col-sm-6 col-12 mb-4">
                      <div className="card">
                          <img src={image} className="card-img" alt={`Gallery for ${event.eventname}`} />
                      </div>
                  </div>
              ))}
          </div>
      </div>
  );
}

export default Gallery;
