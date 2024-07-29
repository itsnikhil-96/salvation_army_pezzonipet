// Events.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import events from '../eventsData'; 
import './Events.css';

function Events() {
    const navigate = useNavigate();

    const handleViewGallery = (eventname) => {
        navigate(`/gallery/${eventname}`);
    };

    return (
        <div className="container mt-3">
            <div className='row text-center'>
                {events.map((event, index) => (
                    <div key={index} className='col-lg-3 col-md-4 col-sm-6 col-12 mb-4'>
                        <div className='card h-100 bg-light shadow-sm'>
                            <div className="card-body d-flex flex-column justify-content-between">
                                <img src={event.mainimage} className="card-img img-fluid" alt={event.eventname} />
                                <p className="fs-3 mt-3 english text-center">
                                    <span className='eventname'>{event.eventname}</span><br /><span className='fs-3'>{event.date}</span>
                                </p>
                                <button 
                                    className="btn btn-primary mt-auto" 
                                    onClick={() => handleViewGallery(event.eventname)}>
                                    View Gallery
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Events;
