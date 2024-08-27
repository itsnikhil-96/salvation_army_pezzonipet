import React, { useState, useEffect, useContext, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import './Events.css';
import { RiDeleteBin6Line } from "react-icons/ri";
import { userLoginContext } from '../contexts/userLoginContext';

function Events() {
    const { userLoginStatus, currentUser } = useContext(userLoginContext);
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [username, setUsername] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const response = await fetch('https://salvation-army-pezzonipet-gn1u.vercel.app/event-api/events');
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

    useEffect(() => {
        if (selectedEvent) {
            document.body.style.overflow = 'hidden'; // Disable scroll
        } else {
            document.body.style.overflow = 'auto'; // Enable scroll
        }
        
        return () => {
            document.body.style.overflow = 'auto'; // Cleanup
        };
    }, [selectedEvent]);

    const handleViewGallery = (eventname) => {
        navigate(`/gallery/${eventname}`);
    };

    const handleDelete = (event) => {
        setSelectedEvent(event);
    };

    const handleConfirmDelete = async () => {
        if (username === currentUser.username) {
            try {
                const encodedEventName = encodeURIComponent(selectedEvent.eventname);
                const response = await fetch(`https://salvation-army-pezzonipet-gn1u.vercel.app/event-api/events?eventname=${encodedEventName}`, {
                    method: 'DELETE',
                });
    
                if (response.ok) {
                    setEvents(events.filter(event => event.eventname !== selectedEvent.eventname));
                    alert(`Successfully deleted Event`);
                    setSelectedEvent(null);
                } else {
                    const result = await response.json();
                    alert(`Failed to delete event: ${result.message}`);
                }
            } catch (error) {
                console.error("Error deleting event:", error);
                alert("Failed to delete event. Please try again later.");
            }
        } else {
            alert("Username does not match!");
        }
    };

    const closeModal = () => {
        setSelectedEvent(null);
        setUsername("");
    };

    const handleOutsideClick = useCallback((e) => {
        if (e.target.classList.contains('modal')) {
            closeModal();
        }
    }, []);

    if (loading) {
        return <div className='loading'>Loading Events please Wait</div>;
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
                                <img 
                                    src={`data:image/jpeg;base64,${event.mainLogo}`} 
                                    className="eventimg img-fluid" 
                                    alt={event.eventname} 
                                />
                                <p className="fs-3 mt-3 english shadowbox text-center">
                                    <span className='eventname'>{event.eventname}</span><br />
                                    <span className='fs-3'>{new Date(event.dateOfEvent).toLocaleDateString()}</span>
                                </p>
                                <div className='row viewgallerybtn'>
                                    <div className='col-10 p-0 m-0'>
                                        <button 
                                            className="btn btn-primary color mt-auto w-100" 
                                            style={{ marginRight: '4px' }} 
                                            onClick={() => handleViewGallery(event.eventname)}>
                                            View Gallery
                                        </button>
                                    </div>
                                    {userLoginStatus && (
                                        <div className='col-2 p-0 m-0'>
                                            <button 
                                                className='w-100 h-100 btn btn-danger text-center' 
                                                style={{ marginLeft: '4px' }} 
                                                onClick={() => handleDelete(event)}>
                                               <RiDeleteBin6Line className='fs-3' />

                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Modal */}
            {selectedEvent && (
                <div className="modal show" style={{ display: 'block' }} tabIndex="-1" role="dialog" onClick={handleOutsideClick}>
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Confirm Deletion</h5>
                                <button type="button" className="close btn btn-danger px-2 py-0" onClick={closeModal}>
                                    <span className='fs-4'>&times;</span>
                                </button>
                            </div>
                            <div className="modal-body">
                                <p>Do you really want to delete the event <strong>{selectedEvent.eventname}</strong>?</p>
                                <div className="form-group">
                                    <label htmlFor="username">Enter your username to confirm:</label>
                                    <input
                                        type="text"
                                        id="username"
                                        className="form-control"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={closeModal}>Cancel</button>
                                <button type="button" className="btn btn-danger" onClick={handleConfirmDelete}>Delete</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Events;
