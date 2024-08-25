import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Events.css';

function Events() {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const response = await fetch('http://localhost:5000/event-api/events');
                if (response.ok) {
                    const data = await response.json();
                    setEvents(data.payload);
                    setLoading(false);
                } else {
                    throw new Error('Failed to fetch events');
                }
            } catch (error) {
                setError(error.message);
                setLoading(false);
            }
        };

        fetchEvents();
    }, []);

    const handleViewGallery = (eventname) => {
        navigate(`/gallery/${eventname}`);
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div className="container mt-3">
            <div className='row text-center'>
                {events.map((event, index) => (
                    <div key={index} className='col-lg-3 col-md-4 col-sm-6 col-12 mb-4'>
                        <div className='card h-100 bg-light shadow-sm'>
                            <div className="card-body d-flex flex-column justify-content-between">
                                {/* Display the main logo if it's a Base64 string */}
                                <img 
                                    src={`data:image/jpeg;base64,${event.mainLogo}`} 
                                    className="eventimg img-fluid" 
                                    alt={event.eventname} 
                                />
                                <p className="fs-3 mt-3 english shadowbox text-center">
                                    <span className='eventname'>{event.eventname}</span><br />
                                    <span className='fs-3'>{new Date(event.dateOfEvent).toLocaleDateString()}</span>
                                </p>
                                <button 
                                    className="btn btn-primary color mt-auto" 
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
