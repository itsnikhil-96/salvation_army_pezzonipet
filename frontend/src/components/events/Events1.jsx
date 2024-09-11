import { useState, useEffect, useContext, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import './Events.css';
import { RiDeleteBin6Line } from "react-icons/ri";
import { userLoginContext } from '../contexts/userLoginContext';

function Events1() {
    const { userLoginStatus, currentUser } = useContext(userLoginContext);
    const [years, setYears] = useState([]);
    const [events, setEvents] = useState([]);
    const [yearsLoading, setYearsLoading] = useState(false);
    const [eventsLoading, setEventsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [yearPage, setYearPage] = useState(0);
    const [yearsHasMore, setYearsHasMore] = useState(true);
    const [currentYear, setCurrentYear] = useState(null); // For tracking which year's events are being loaded

    const observer = useRef();
    const limit = 1;

    // Fetch years with pagination
    useEffect(() => {
        const fetchYears = async () => {
            setYearsLoading(true);
            try {
                const response = await fetch(`https://salvation-army-pezzonipet-gn1u.vercel.app/event-api/years?limit=${limit}&skip=${yearPage * limit}`);
                const data = await response.json();
                const fetchedYears = data.payload.year || [];
                
                if (fetchedYears.length < limit) {
                    setYearsHasMore(false);
                }

                setYears(prevYears => [...prevYears, ...fetchedYears]);

                if (fetchedYears.length > 0) {
                    setCurrentYear(fetchedYears[0].year);
                }

            } catch (error) {
                console.error("Fetching error:", error);
                setError(error.message);
            } finally {
                setYearsLoading(false);
            }
        };

        fetchYears();
    }, [yearPage]);

    useEffect(() => {
        if (currentYear !== null) {
            const fetchEvents = async () => {
                setEventsLoading(true);
                try {
                    const response = await fetch(`https://salvation-army-pezzonipet-gn1u.vercel.app/event-api/events/year?year=${currentYear}`);
                    const data = await response.json();
                    setEvents(prevEvents => [...prevEvents, ...data.payload]);
                } catch (error) {
                    console.error("Fetching error:", error);
                    setError(error.message);
                } finally {
                    setEventsLoading(false);
                }
            };

            fetchEvents();
        }
    }, [currentYear,events]);

    // Observer to load more years when the last year is in view
    const lastYearElementRef = useCallback(node => {
        if (yearsLoading) return;
        if (observer.current) observer.current.disconnect();
        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && yearsHasMore) {
                setYearPage(prevPage => prevPage + 1);
            }
        });
        if (node) observer.current.observe(node);
    }, [yearsLoading, yearsHasMore]);

    return (
        <div className="container mt-3 position-relative">
            <div className='row text-center'>
                {error && <div>Error: {error}</div>}
                {years.map((yearData, index) => (
                    <div key={yearData.year} ref={index === years.length - 1 ? lastYearElementRef : null}>
                        <h3 className='year-title'>{yearData.year}</h3>
                        <div className='row'>
                            {events
                                .filter(event => event.year === yearData.year)
                                .map((event) => (
                                    <div key={event._id} className='col-lg-4 col-xl-3 col-md-6 col-sm-6 col-12 mb-4'>
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
                                                            onClick={() => handleViewGallery(event.eventname)}>
                                                            View Gallery
                                                        </button>
                                                    </div>
                                                    {userLoginStatus && (
                                                        <div className='col-2 p-0 m-0'>
                                                            <button
                                                                className='btn btn-danger text-center'
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
                    </div>
                ))}
            </div>

            {yearsLoading && <div className='loading mb-3'>Loading more years...</div>}
            {eventsLoading && <div className='loading mb-3'>Loading events...</div>}
        </div>
    );
}

export default Events1;
