import React, { useState, useEffect, useContext, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import './Events.css';
import { RiDeleteBin6Line } from "react-icons/ri";
import { userLoginContext } from '../contexts/userLoginContext';

function Events() {
    const { userLoginStatus, currentUser } = useContext(userLoginContext);
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [username, setUsername] = useState("");
    const [page, setPage] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const observer = useRef();
    const navigate = useNavigate();

    const limit = 1;

    useEffect(() => {
        const fetchEvents = async () => {
            setLoading(true);
            try {
                const response = await fetch(`http://localhost:5000/event-api/events?skip=${page * limit}&limit=${limit}`);
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                const data = await response.json();
                setEvents(prevEvents => [...prevEvents, ...data.payload]);
                if (data.payload.length < limit) {
                    setHasMore(false);
                }
            } catch (error) {
                console.error("Fetching error:", error); // Log the error
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchEvents();
    }, [page]);

    const lastEventElementRef = useCallback(node => {
        if (loading) return;
        if (observer.current) observer.current.disconnect();
        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && hasMore) {
                setPage(prevPage => prevPage + 1);
            }
        });
        if (node) observer.current.observe(node);
    }, [loading, hasMore]);

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
                const encodedUsername = encodeURIComponent(username);  // Encode the username to include it in the URL
                const res2 = await fetch(`http://localhost:5000/event-api/events?eventname=${encodedEventName}&username=${encodedUsername}`, {
                    method: 'DELETE',
                });
    
                if (res2.ok) {
                    setEvents(events.filter(event => event.eventname !== selectedEvent.eventname));
                    alert('Successfully deleted event');
                    setSelectedEvent(null);
                } else {
                    const result = await res2.json();
                    alert(`Failed to delete event: ${result.message}`);
                }
            } catch (error) {
                console.error('Error deleting event:', error);
                alert('Failed to delete event. Please try again later.');
            }
        } else {
            alert('Username does not match!');
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

    return (
        <div className="container mt-3 position-relative">
            <div style={{ minHeight: userLoginStatus ? '50px' : '0px' }}>
                {userLoginStatus && (
                    <button 
                        className="btn btn-outline-secondary position-absolute top-0 end-0 me-3"
                        onClick={() => navigate('/addevent')}
                    >
                        Add Event
                    </button>
                )}
            </div>

            <div className='row text-center'>
                {error && <div>Error: {error}</div>}
                {events.map((event, index) => (
                    <div 
                        key={index} 
                        className='col-lg-4 col-xl-3 col-md-6 col-sm-6 col-12 mb-4'
                        ref={index === events.length - 1 ? lastEventElementRef : null}
                    >
                        <div className='card h-100 bg-light shadow-sm text-center'>
                            <div className="card-body d-flex flex-column justify-content-between">
                                {event.mainLogoData && (
                                    <img 
                                        src={`data:image/jpeg;base64,${event.mainLogoData}`} 
                                        className="eventimg img-fluid" 
                                        alt={event.eventname} 
                                    />
                                )}
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
                                                className=' btn btn-danger text-center' 
                                                style={{ marginLeft: '4px' }} 
                                                onClick={() => handleDelete(event)}>
                                               <div className='p-0'> <RiDeleteBin6Line /></div>
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {loading && <div className='loading mb-3'>Loading Events please Wait</div>}
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
