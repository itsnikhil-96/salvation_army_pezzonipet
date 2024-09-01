import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import imageCompression from 'browser-image-compression';
import './AddEvent.css';

function AddEvent() {
  const [eventName, setEventName] = useState('');
  const [dateOfEvent, setDateOfEvent] = useState('');
  const [mainLogoFile, setMainLogoFile] = useState(null); 
  const [imagesFiles, setImagesFiles] = useState([]); 
  const [compressedImagesSize, setCompressedImagesSize] = useState(0);
  const [message, setMessage] = useState(''); 
  const [messageType, setMessageType] = useState(''); 
  const [isUploading, setIsUploading] = useState(false);

  const navigate = useNavigate();

  const handleMainLogoChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      console.log(`Original main logo file size: ${file.size / 1024} KB`);
      try {
        const options = {
          maxSizeMB: 2,  // Set maximum file size to 2 MB
          maxWidthOrHeight: 800,
        };
        const compressedFile = await imageCompression(file, options);
        console.log(`Compressed main logo file size: ${compressedFile.size / 1024} KB`);
        setMainLogoFile(compressedFile);
      } catch (error) {
        console.error("Error compressing main logo image:", error);
        setMessageType('error');
        setMessage('Error compressing main logo image.');
      }
    }
  };

  const handleImagesChange = async (e) => {
    const files = Array.from(e.target.files);

    if (files.length > 100) {
      alert("You can only upload up to 100 images at a time.");
      return;
    }

    let totalCompressedSize = 0;

    try {
      const options = {
        maxSizeMB: 2,  // Set maximum file size to 2 MB
        maxWidthOrHeight: 800,
      };
      const compressedFiles = await Promise.all(
        files.map(async (file) => {
          console.log(`Original image file size: ${file.size / 1024} KB`);
          const compressedFile = await imageCompression(file, options);
          totalCompressedSize += compressedFile.size;
          console.log(`Compressed image file size: ${compressedFile.size / 1024} KB`);
          return compressedFile;
        })
      );
      setImagesFiles(compressedFiles);
      setCompressedImagesSize(totalCompressedSize);
    } catch (error) {
      console.error("Error compressing images:", error);
      setMessageType('error');
      setMessage('Error compressing images.');
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsUploading(true);

    if (!eventName || !dateOfEvent || !mainLogoFile || imagesFiles.length === 0) {
      setMessageType('error');
      setMessage('Please fill in all fields and select at least one image.');
      setIsUploading(false);
      return;
    }

    const formData = new FormData();
    formData.append('eventname', eventName);
    formData.append('dateOfEvent', dateOfEvent);
    formData.append('mainLogo', mainLogoFile);
    imagesFiles.forEach(file => formData.append('images', file));

    try {
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        timeout: 600000, // Set a long timeout for the request
      };

      const res = await axios.post("https://salvation-army-pezzonipet-gn1u.vercel.app/event-api/create", formData, config);
      console.log(res.status);
      console.log(res.data.message);
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
          <p>Compressed Images Size: {(compressedImagesSize / 1024).toFixed(2)} KB</p>
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
