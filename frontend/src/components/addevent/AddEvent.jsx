import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './AddEvent.css';

function AddEvent() {
  const [eventName, setEventName] = useState('');
  const [dateOfEvent, setDateOfEvent] = useState('');
  const [mainLogoFile, setMainLogoFile] = useState(null); 
  const [imagesFiles, setImagesFiles] = useState([]); 
  const [message, setMessage] = useState(''); 
  const [messageType, setMessageType] = useState(''); 
  const [isUploading, setIsUploading] = useState(false);

  const navigate = useNavigate();

  const handleMainLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setMainLogoFile(file);
    }
  };

  const handleImagesChange = (e) => {
    const files = Array.from(e.target.files);
    setImagesFiles(files);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsUploading(true);

    const formData = new FormData();
    formData.append('eventname', eventName);
    formData.append('dateOfEvent', dateOfEvent);
    formData.append('mainLogo', mainLogoFile);
    imagesFiles.forEach(file => formData.append('images', file));

    try {
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        onUploadProgress: (progressEvent) => {
          // You can update progress here if needed
        },
        timeout: 600000 
      };

      const res = await axios.post("https://salvation-army-pezzonipet-gn1u.vercel.app/event-api/create", formData, config);
       console.log(res.status);
      if (res.status === 201) {
        setMessageType('success'); 
        setMessage(res.data.message); 
        navigate("/events"); 
      } else {
        setMessageType('error'); 
        throw new Error(res.data.message || 'Failed to add event'); 
      }
    } catch (err) {
      setMessageType('error'); 
      setMessage(err.message); 
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="form-container mt-5 english">
      <h3 className="heading">Add Event</h3>
      <div className={`message ${messageType}`}>
        {message && <p>{message}</p>}
      </div>

      <form onSubmit={handleSubmit} className="form">
        <div className="form-group">
          <label>Event Name:</label>
          <input
            type="text"
            value={eventName}
            onChange={(e) => setEventName(e.target.value)}
            required
            disabled={isUploading}
          />
        </div>

        <div className="form-group">
          <label>Date of Event:</label>
          <input
            type="date"
            value={dateOfEvent}
            onChange={(e) => setDateOfEvent(e.target.value)}
            required
            disabled={isUploading}
          />
        </div>

        <div className="form-group">
          <label>Main Logo:</label>
          <input
            type="file"
            onChange={handleMainLogoChange}
            accept="image/*"
            required
            disabled={isUploading}
          />
        </div>

        <div className="form-group">
          <label>Additional Images:</label>
          <input
            type="file"
            onChange={handleImagesChange}
            accept="image/*"
            multiple
            required
            disabled={isUploading}
          />
        </div>

        <div className="text-center">
          {!isUploading ? (
            <button className="addeventbutton" type="submit">
              Add Event
            </button>
          ) : (
            <p>Please wait, uploading images...</p>
          )}
        </div>
      </form>
    </div>
  );
}

export default AddEvent;
