import React, { useState, useEffect, useContext, useRef } from 'react';
import { useParams } from 'react-router-dom';
import './Gallery.css';
import { userLoginContext } from '../contexts/userLoginContext';

function Gallery() {
    const { userLoginStatus } = useContext(userLoginContext); 
    const { eventname } = useParams();
    const [eventImages, setEventImages] = useState([]);  // Storing all fetched images
    const [page, setPage] = useState(0);  // Tracks the page for pagination
    const [hasMore, setHasMore] = useState(true);  // Tracks if there are more images to load
    const [loading, setLoading] = useState(false);  // Tracks if images are being loaded
    const [error, setError] = useState(null);  // Error handling state
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [isUploading, setIsUploading] = useState(false);  // Tracks the upload state
    const limit = 3;  // Number of images to fetch per page

    const observer = useRef();  // Reference to the intersection observer
    const lastImageRef = useRef();  // Reference to the last image element

    useEffect(() => {
        const fetchImages = async () => {
            setLoading(true);
            try {
                const res = await fetch(`https://salvation-army-pezzonipet-gn1u.vercel.app/event-api/events/${eventname}?skip=${page * limit}&limit=${limit}`);
                if (!res.ok) {
                    throw new Error('Event not found');
                }
                const data = await res.json();

                // If there are fewer images than the limit, it means there are no more images to load
                if (data.payload.length < limit) {
                    setHasMore(false);
                }

                // Append new images to the existing list
                setEventImages((prevImages) => [...prevImages, ...data.payload]);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchImages();
    }, [eventname, page]);

    useEffect(() => {
        if (loading || !hasMore) return;

        if (observer.current) observer.current.disconnect();  // Disconnect previous observer if any

        observer.current = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                setPage((prevPage) => prevPage + 1);  // Load more images by increasing the page number
            }
        });

        if (lastImageRef.current) observer.current.observe(lastImageRef.current);  // Observe the last image

    }, [loading, hasMore]);

    const handleFileChange = (e) => {
        setSelectedFiles(Array.from(e.target.files));
    };

    const handleUpload = async () => {
        if (selectedFiles.length > 15) {
            alert('You can only upload up to 15 images.');
            setSelectedFiles([]);
            return;
        }

        setIsUploading(true);  // Show uploading state

        const formData = new FormData();
        selectedFiles.forEach(file => {
            formData.append('images', file);
        });

        try {
            const res = await fetch(`https://salvation-army-pezzonipet-gn1u.vercel.app/event-api/events/${eventname}/images`, {
                method: 'POST',
                body: formData
            });

            if (!res.ok) {
                throw new Error('Failed to upload images');
            }

            const data = await res.json();
            setEventImages((prevImages) => [
                ...prevImages,
                ...data.payload.images
            ]);
            setSelectedFiles([]);
            alert('Images uploaded successfully');
        } catch (err) {
            alert(err.message);
        } finally {
            setIsUploading(false);  // Hide uploading state
        }
    };

    if (error) {
        return <div className="container mt-5 alert alert-danger"><h2>{error}</h2></div>;
    }

    return (
        <div className="container mt-5 position-relative">
            <div className='marginbtn'>
                {userLoginStatus && (
                    <>
                        <input
                            type="file"
                            id="file-upload"
                            multiple
                            accept="image/*"
                            style={{ display: 'none' }}
                            onChange={handleFileChange}
                        />
                        {!isUploading && (
                            <>
                                {selectedFiles.length === 0 ? (
                                    <button
                                        className="btn btn-outline-secondary position-absolute top-0 end-0 me-3"
                                        onClick={() => document.getElementById('file-upload').click()}
                                    >
                                        Select Images
                                    </button>
                                ) : (
                                    <button
                                        className="btn btn-primary position-absolute top-0 end-0 me-3"
                                        onClick={handleUpload}
                                    >
                                        Upload Images
                                    </button>
                                )}
                            </>
                        )}
                        {isUploading && (
                            <button
                                className="btn btn-success position-absolute top-0 end-0 me-3"
                                disabled
                            >
                                Uploading...
                            </button>
                        )}
                    </>
                )}
            </div>
            <h1 className="text-center mb-3 fs-3 heading">{eventname} Gallery</h1>
            <div className="row">
                {eventImages.length > 0 ? (
                    eventImages.map((imageData, index) => {
                        const isLastImage = index === eventImages.length - 1;
                        return (
                            <div
                                key={index}
                                ref={isLastImage ? lastImageRef : null}  // Add ref to the last image
                                className="col-lg-2 col-md-3 col-sm-6 col-12 mb-4 gallerycol"
                            >
                                <div className="gallery-item">
                                    <img 
                                        src={imageData} 
                                        className="galleryimg" 
                                        alt={`Gallery for ${eventname}`} 
                                    />
                                </div>
                            </div>
                        );
                    })
                ) : (
                    // Show loading indicator or "No images available" message based on state
                    !loading && (
                        <div className="col-12 text-center">
                            <p>No images available.</p>
                        </div>
                    )
                )}
            </div>
            {loading && !eventImages.length && (
                <div className="text-center loading">Loading images...</div>
            )}
            {loading && eventImages.length > 0 && (
                <div className="text-center loading">Loading more images...</div>
            )}
        </div>
    );
}

export default Gallery;
