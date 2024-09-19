import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './DeletedEvents.css';

function DeletedEvents() {
  const [deletedEvents, setDeletedEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshDeletedEvents, setRefreshDeletedEvents] = useState(false); // New state for refreshing events

  // Fetch deleted events, re-runs when 'refreshDeletedEvents' changes
  useEffect(() => {
    const fetchDeletedEvents = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:5000/event-api/deleted-events'); // Replace with your actual backend route
        setDeletedEvents(response.data.payload);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching deleted events:', error);
        setLoading(false);
      }
    };

    fetchDeletedEvents();
  }, [refreshDeletedEvents]); // Dependency added

  // Function to restore a deleted event
  const restoreEvent = async (eventname) => {
    try {
      await axios.post('http://localhost:5000/event-api/events/restore', { eventname }); // Replace with your actual restore route
      alert(`Event ${eventname} restored successfully`);

      // Trigger re-fetch of deleted events
      setRefreshDeletedEvents(prev => !prev); // Toggle to trigger useEffect
    } catch (error) {
      console.error(`Error restoring event ${eventname}:`, error);
      alert('Failed to restore event. Please try again.');
    }
  };

  if (loading) {
    return <p className='loading'>Loading deleted events...</p>;
  }

  if (!deletedEvents.length) {
    return <p>No deleted events available to restore.</p>;
  }

  return (
    <div className='english'>
      <h2 className='mt-4'>Restore Deleted Events</h2>
      <table border="1" cellPadding="10" cellSpacing="0">
        <thead>
          <tr>
            <th>S.No</th>
            <th>Event Name</th>
            <th>Date of Event</th>
            <th>Deleted By</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {deletedEvents.map((event, index) => (
            <tr key={event.eventname}>
              <td>{index + 1}</td>
              <td>{event.eventname}</td>
              <td>{new Date(event.dateOfEvent).toLocaleDateString()}</td>
              <td>{event.deletedBy}</td>
              <td>
                <button className='restorebtn'onClick={() => restoreEvent(event.eventname)}>
                  Restore
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default DeletedEvents;
