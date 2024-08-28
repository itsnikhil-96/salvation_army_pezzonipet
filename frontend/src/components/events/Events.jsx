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
                } else {
                    throw new Error('Failed to fetch events');
                }
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchEvents();
    }, []);

    useEffect(() => {
        document.body.style.overflow = selectedEvent ? 'hidden' : 'auto';
        
        return () => {
            document.body.style.overflow = 'auto';
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

            const eventDetails = {
              eventname: selectedEvent.eventname,
              dateOfEvent: selectedEvent.dateOfEvent,
              mainLogo: selectedEvent.mainLogo,
              images: selectedEvent.images, 
            };
      
            const res1 = await fetch('https://salvation-army-pezzonipet-gn1u.vercel.app/user-api/adddeletedevent', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username: currentUser.username, eventDetails })
              });              
        
              if (!res1.ok) {
                throw new Error('Failed to update deletedevents');
              }
        
            // Proceed with event deletion
            const encodedEventName = encodeURIComponent(selectedEvent.eventname);
            const res2 = await fetch(`https://salvation-army-pezzonipet-gn1u.vercel.app/event-api/events?eventname=${encodedEventName}`, {
              method: 'DELETE',
            });
      
            if (res2.ok) {
              setEvents(events.filter(event => event.eventname !== selectedEvent.eventname));
              alert('Successfully deleted Event');
              setSelectedEvent(null);
            } else {
              const result = await deleteRes.json();
              alert(`Failed to delete event: ${result.message}`);
            }
      
            const deleteddetails = {
              eventname: selectedEvent.eventname,
              username
            };
      
            const res = await fetch('https://salvation-army-pezzonipet-gn1u.vercel.app/deleted-api/delete', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify(deleteddetails)
            });
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
            <div className='row'>
                <div className='col-8 heading fs-3'>
                   
                </div>
                <div className='col-4'>
                {userLoginStatus && (
                <button 
                    className="btn btn-success position-absolute top-0 end-0 m-3 me-3"
                    onClick={() => navigate('/addevent')}
                >
                    Add Event
                </button>
            )}
                </div>
            </div>

            <div className='row text-center marginht'>
                {loading && <div className='loading'>Loading Events please Wait</div>}
                {error && <div>Error: {error}</div>}
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
                                                <RiDeleteBin6Line />
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

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
