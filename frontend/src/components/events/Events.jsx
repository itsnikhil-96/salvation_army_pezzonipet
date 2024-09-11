import React, { useState, useEffect, useContext, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import './Events.css';
import { RiDeleteBin6Line } from "react-icons/ri";
import { userLoginContext } from '../contexts/userLoginContext';

function Events() {
    const { userLoginStatus, currentUser } = useContext(userLoginContext);
    const [years, setYears] = useState([]);
    const [eventsByYear, setEventsByYear] = useState({});
    const [currentYearIndex, setCurrentYearIndex] = useState(0); // Track the index of the current year being displayed
    const [eventPages, setEventPages] = useState({}); // Tracks the pagination for events per year
    const [loadingEvents, setLoadingEvents] = useState(false);
    const [error, setError] = useState(null);
    const [hasMoreEvents, setHasMoreEvents] = useState(true); // Control if more events can be loaded
    const observerEvents = useRef();
    const navigate = useNavigate();

    const limit = 1; // Number of events per fetch

    // Fetch years only once and store them in state
    useEffect(() => {
        const fetchYears = async () => {
            try {
                const response = await fetch(`https://salvation-army-pezzonipet-gn1u.vercel.app/event-api/years`);
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                const data = await response.json();
                const fetchedYears = data.payload || [];

                if (fetchedYears.length === 0) {
                    setError("No years found");
                } else {
                    setYears(fetchedYears);
                }
            } catch (error) {
                console.error("Fetching error:", error);
                setError(error.message);
            }
        };

        fetchYears();
    }, []); // Empty dependency array ensures it only runs once

    // Fetch events for the current year
    useEffect(() => {
        if (years.length === 0 || currentYearIndex >= years.length) return;

        const currentYear = years[currentYearIndex].year;

        const fetchEventsForYear = async () => {
            if (!hasMoreEvents) return; // Don't fetch if no more events are available
            setLoadingEvents(true);
            try {
                const currentPage = eventPages[currentYear] || 0;
                const response = await fetch(`https://salvation-army-pezzonipet-gn1u.vercel.app/event-api/events/year/${currentYear}?skip=${currentPage * limit}&limit=${limit}`);
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                const data = await response.json();
                const fetchedEvents = data.payload || [];

                setEventsByYear(prevEventsByYear => ({
                    ...prevEventsByYear,
                    [currentYear]: [...(prevEventsByYear[currentYear] || []), ...fetchedEvents],
                }));

                if (fetchedEvents.length < limit) {
                    setHasMoreEvents(false); // No more events to load for this year
                } else {
                    setEventPages(prevPages => ({
                        ...prevPages,
                        [currentYear]: currentPage + 1,
                    }));
                }
            } catch (error) {
                console.error("Fetching error:", error);
                setError(error.message);
            } finally {
                setLoadingEvents(false);
            }
        };

        fetchEventsForYear();
    }, [years, currentYearIndex, eventPages, hasMoreEvents]);

    // Observer to load more events
    const lastEventElementRef = useCallback((year, node) => {
        if (loadingEvents || !hasMoreEvents) return;
        if (observerEvents.current) observerEvents.current.disconnect();
        observerEvents.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && hasMoreEvents) {
                setEventPages(prevPages => ({
                    ...prevPages,
                    [year]: (prevPages[year] || 0) + 1,
                }));
            }
        });
        if (node) observerEvents.current.observe(node);
    }, [loadingEvents, hasMoreEvents]);

    const handleViewGallery = (eventname) => {
        navigate(`/gallery/${eventname}`);
    };

    const handleDelete = (event) => {
        setSelectedEvent(event);
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

    // Move to the next year when events for the current year are done loading
    useEffect(() => {
        if (!hasMoreEvents && currentYearIndex < years.length - 1) {
            setCurrentYearIndex(currentYearIndex + 1);
            setHasMoreEvents(true); // Reset for the next year
        }
    }, [hasMoreEvents, currentYearIndex, years]);

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
                {years.slice(0, currentYearIndex + 1).map((yearData) => {
                    const year = yearData.year;
                    const events = eventsByYear[year] || [];

                    return (
                        <div key={year}>
                            <h3 className='heading'>{year} Events</h3>
                            <div className='row'>
                                {events.map((event, index) => (
                                    <div
                                        key={event._id}
                                        className='col-lg-4 col-xl-3 col-md-6 col-sm-6 col-12 mb-4'
                                        ref={index === events.length - 1 ? (node) => lastEventElementRef(year, node) : null}
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
                                                                className='btn btn-danger text-center'
                                                                style={{ marginLeft: '4px' }}
                                                                onClick={() => handleDelete(event)}>
                                                                <div className='p-0'> <RiDeleteBin6Line /> </div>
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    );
                })}
                <div>
                    {loadingEvents && <div className='loading'>Loading Events please wait</div>}
                </div>
            </div>
        </div>
    );
}

export default Events;
