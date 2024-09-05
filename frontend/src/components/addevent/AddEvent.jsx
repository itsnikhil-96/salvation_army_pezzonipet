import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import imageCompression from 'browser-image-compression';
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

  // Handle the main logo compression and selection
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
    try {
      const options = {
        maxSizeMB: 1,
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
    } catch (error) {
      console.error("Error compressing images:", error);
      setMessageType('error');
      setMessage('Error compressing images.');
    }
  };

  // Handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();

    if (imageCount > 20) {
      return;
    }

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
          'Content-Type': 'multipart/form-data'
        },
        onUploadProgress: (progressEvent) => {
          // This event can be used to update progress if you still want to track it
          // For now, we are only displaying a static message.
        },
        timeout: 600000 
      };

      const res = await axios.post("https://salvation-army-pezzonipet-gn1u.vercel.app/event-api/create", formData, config);
       console.log(res.status);
      if (res.status === 201) {
        setMessageType('success'); 
        setMessage(res.data.message); 
        setTimeout(() => {
          navigate("/events"); 
        }, 1000); 
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
      <p className='text-center eventpics'>Maximum of 20 pics are allowed</p>

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
          <p>Compressed Images Size: {(compressedImagesSize / 1024).toFixed(2)} KB</p>
        </div>

        <div className="text-center">
          {imageCount ? (
            <p className="uploading-message text-danger">Can't upload more than 20 pics.</p>
          ) : isUploading ? (
            <p className="uploading-message">Uploading event, please wait...</p>
          ) : (
            <button
              className="addeventbutton"
              type="submit"
              disabled={imageCount === 0}
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
