import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AddEvent.css';

function AddEvent() {
  const [eventName, setEventName] = useState('');
  const [dateOfEvent, setDateOfEvent] = useState('');
  const [mainLogo, setMainLogo] = useState(null);
  const [mainLogoFile, setMainLogoFile] = useState(null); 
  const [images, setImages] = useState([]);
  const [imagesFiles, setImagesFiles] = useState([]); 
  const [err, setErr] = useState(null);

  const navigate = useNavigate();

  const handleMainLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setMainLogoFile(file); 

      const reader = new FileReader();
      reader.onloadend = () => {
        setMainLogo(reader.result); 
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImagesChange = (e) => {
    const files = Array.from(e.target.files);
    setImagesFiles(files); 

    const promises = files.map(file => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          resolve(reader.result); 
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
    });

    Promise.all(promises)
      .then(base64Images => {
        setImages(base64Images); 
      })
      .catch(err => {
        console.error("Error converting images to Base64:", err);
      });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append('eventname', eventName);
    formData.append('dateOfEvent', dateOfEvent); 
    formData.append('mainLogo', mainLogoFile); 
    imagesFiles.forEach(file => formData.append('images', file)); 
    try {
      const res = await fetch("http://localhost:5000/event-api/create", {
        method: "POST",
        body: formData,
      });
      if (res.ok) {
        navigate("/events");
      } else {
        const errorResponse = await res.json();
        throw new Error(errorResponse.message || 'Failed to add event');
      }
    } catch (err) {
      setErr(err.message);
    }
  };

  return (
    <div className="form-container mt-5">
      <h3 className="heading">Add Event</h3>
      <form onSubmit={handleSubmit} className="form">
        <div className="form-group">
          <label>Event Name:</label>
          <input
            type="text"
            value={eventName}
            onChange={(e) => setEventName(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>Date of Event:</label>
          <input
            type="date"
            value={dateOfEvent}
            onChange={(e) => setDateOfEvent(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>Main Logo:</label>
          <input
            type="file"
            onChange={handleMainLogoChange}
            accept="image/*"
            required
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
          />
         
        </div>

        <div className="text-center">
          <button className="addeventbutton" type="submit">
            Add Event
          </button>
        </div>

        {err && <p className="error-message">{err}</p>}
      </form>
    </div>
  );
}

export default AddEvent;
