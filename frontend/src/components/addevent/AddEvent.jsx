import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import imageCompression from 'browser-image-compression';
import './AddEvent.css';

function AddEvent() {
  const [eventName, setEventName] = useState('');
  const [dateOfEvent, setDateOfEvent] = useState('');
  const [mainLogoFile, setMainLogoFile] = useState(null); 
  const [imagesFiles, setImagesFiles] = useState([]); 
  const [imageCount, setImageCount] = useState(0); // State for image count
  const [message, setMessage] = useState(''); 
  const [messageType, setMessageType] = useState(''); 
  const [isUploading, setIsUploading] = useState(false);

  const navigate = useNavigate();

  // Handle the main logo compression and selection
  const handleMainLogoChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        const options = {
          maxSizeMB: 2,
          maxWidthOrHeight: 800,
        };
        const compressedFile = await imageCompression(file, options);
        setMainLogoFile(compressedFile);
      } catch (error) {
        console.error("Error compressing image:", error);
      }
    }
  };

  // Handle the additional images compression and selection
  const handleImagesChange = async (e) => {
    const files = Array.from(e.target.files);
    setImageCount(0);
    if (files.length > 15) {
      setImageCount(1);
      return;
    }

    try {
      const options = {
        maxSizeMB: 3,
        maxWidthOrHeight: 800,
      };
      const compressedFiles = await Promise.all(
        files.map(file => imageCompression(file, options))
      );
      setImagesFiles(compressedFiles);
      setMessage('');
      setMessageType('');
    } catch (error) {
      console.error("Error compressing images:", error);
    }
  };

  // Handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsUploading(true);
    const formData = new FormData();
    formData.append('eventname', eventName);
    formData.append('dateOfEvent', dateOfEvent);
    formData.append('mainLogo', mainLogoFile);
    imagesFiles.forEach(file => formData.append('images', file));

    try {
      const res = await fetch("https://salvation-army-pezzonipet-gn1u.vercel.app/event-api/create", {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (res.status === 201) {
        setMessageType('success');
        setMessage(data.message);
        navigate("/events");
      } else {
        setMessageType('error');
        throw new Error(data.message || 'Failed to add event');
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
      <p className='text-center eventpics'>Maximum of 15 pics are allowed</p>

      {message && <p className={`message ${messageType}`}>{message}</p>}

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
          {imageCount? (
            <p className="error-message">Can't upload more than 15 pics.</p>
          ) : isUploading ? (
            <p className="uploading-message">Uploading event, please wait...</p>
          ) : (
            <button
              className="addeventbutton"
              type="submit"
            >
              Add Event
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

export default AddEvent;
