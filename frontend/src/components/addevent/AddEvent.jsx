import React, { useState } from 'react';
import './AddEvent.css';

function AddEvent() {
  const [eventName, setEventName] = useState('');
  const [eventDescription, setEventDescription] = useState('');
  const [mainLogo, setMainLogo] = useState(null);
  const [images, setImages] = useState([]);
  const [events, setEvents] = useState([]);

  const handleMainLogoChange = (e) => {
    setMainLogo(e.target.files[0]);
  };

  const handleImagesChange = (e) => {
    setImages([...images, ...Array.from(e.target.files)]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newEvent = {
      name: eventName,
      description: eventDescription,
      mainLogo,
      images,
    };
    setEvents([...events, newEvent]);
    // Reset form
    setEventName('');
    setEventDescription('');
    setMainLogo(null);
    setImages([]);
  };

  return (
    <div className="form-container mt-5">
      <h3 className='heading'>Add Event</h3>
      <form onSubmit={handleSubmit} className="form">
        <div className="form-group">
          <label>Event Name:</label>
          <input
            type="text"
            value={eventName}
            onChange={(e) => setEventName(e.target.value)}
          />
        </div>
       
        <div className="form-group">
          <label>Main Logo:</label>
          <input
            type="file"
            onChange={handleMainLogoChange}
            accept="image/*"
          />
        </div>
        <div className="form-group">
          <label>Images:</label>
          <input
            type="file"
            onChange={handleImagesChange}
            accept="image/*"
            multiple
          />
        </div>
        <div className='text-center'>
        <button className='addeventbutton' type="submit">Add Event</button>
        </div>
      </form>
    </div>
  );
}

export default AddEvent;
