import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './Gallery.css';

function Gallery() {
    const { eventname } = useParams();
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchEvent = async () => {
            try {
                const res = await fetch(`http://localhost:5000/event-api/events/${eventname}`);
                if (!res.ok) {
                    throw new Error('Event not found');
                }
                const data = await res.json();
                setEvent(data.payload);
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };

        fetchEvent();
    }, [eventname]);

    if (loading) {
        return <div><h2 className='loading'>Loading Images Please wait....</h2></div>;
    }

    if (error) {
        return <div className="container mt-5"><h2>{error}</h2></div>;
    }

    if (!event) {
        return <div className="container mt-5"><h2>Event not found</h2></div>;
    }

    return (
        <div className="container mt-5">
            <h1 className="text-center mb-3 fs-3 heading">{event.eventname} Gallery</h1>
            <div className="row">
                {event.images.map((image, index) => (
                    <div key={index} className="col-lg-2 col-md-3 col-sm-6 col-12 mb-4 gallerycol">
                        <div className="gallery-item">
                            <a 
                                href={`data:image/jpeg;base64,${image}`} 
                                download={`image-${index}.jpg`} 
                                className="gallery-link"
                            >
                                <img 
                                    src={`data:image/jpeg;base64,${image}`} 
                                    className="galleryimg" 
                                    alt={`Gallery for ${event.eventname}`} 
                                />
                                
                            </a>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Gallery;
