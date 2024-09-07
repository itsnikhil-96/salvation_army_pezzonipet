import React, { useState, useEffect, useContext, useRef } from 'react';
import { useParams } from 'react-router-dom';
import './Gallery.css';
import { MdDownload } from "react-icons/md";
import { RiDeleteBin6Line } from "react-icons/ri";
import { ImCross } from "react-icons/im";
import { userLoginContext } from '../contexts/userLoginContext';

function Gallery() {
    const { userLoginStatus } = useContext(userLoginContext);
    const { eventname } = useParams();
    const [eventImages, setEventImages] = useState([]);
    const [page, setPage] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [isUploading, setIsUploading] = useState(false);
    const [isViewerOpen, setIsViewerOpen] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(null);

    const [showModal, setShowModal] = useState(false); 
    const [imageToDelete, setImageToDelete] = useState(null);  

    const limit = 3;

    const observer = useRef();
    const lastImageRef = useRef();
    const touchStartXRef = useRef(null);

    useEffect(() => {
        const fetchImages = async () => {
            setLoading(true);
            try {
                const res = await fetch(`https://salvation-army-pezzonipet-gn1u.vercel.app/event-api/events/${eventname}?skip=${page * limit}&limit=${limit}`);
                if (!res.ok) {
                    throw new Error('Event not found');
                }
                const data = await res.json();
                if (data.payload.length < limit) {
                    setHasMore(false);
                }
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
        if (observer.current) observer.current.disconnect();
        observer.current = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                setPage((prevPage) => prevPage + 1);
            }
        });
        if (lastImageRef.current) observer.current.observe(lastImageRef.current);
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
        setIsUploading(true);
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
            setEventImages((prevImages) => [...prevImages, ...data.payload.images]);
            setSelectedFiles([]);
            alert('Images uploaded successfully');
        } catch (err) {
            alert(err.message);
        } finally {
            setIsUploading(false);
            setSelectedFiles([]);
        }
    };

    const handleImageClick = (index) => {
        setCurrentImageIndex(index);
        setIsViewerOpen(true);
        document.body.style.overflow = 'hidden'; // Disable scroll
    };

    const handleCloseViewer = () => {
        setIsViewerOpen(false);
        setCurrentImageIndex(null);
        document.body.style.overflow = 'auto'; // Enable scroll
    };

    const handleTouchStart = (e) => {
        touchStartXRef.current = e.touches[0].clientX;
    };

    const handleTouchEnd = (e) => {
        const touchEndX = e.changedTouches[0].clientX;
        const touchDiff = touchStartXRef.current - touchEndX;
        if (touchDiff > 50) {
            handleNextImage();
        } else if (touchDiff < -50) {
            handlePrevImage();
        }
    };

    const handleNextImage = () => {
        if (currentImageIndex < eventImages.length - 1) {
            setCurrentImageIndex((prevIndex) => prevIndex + 1);
        }
    };

    const handlePrevImage = () => {
        if (currentImageIndex > 0) {
            setCurrentImageIndex((prevIndex) => prevIndex - 1);
        }
    };

    const handleDeleteImage = async () => {
        try {
            const res = await fetch(`https://salvation-army-pezzonipet-gn1u.vercel.app/event-api/events/${eventname}/images/${imageToDelete}`, {
                method: 'DELETE'
            });
            if (!res.ok) {
                throw new Error('Failed to delete image');
            }
            alert('Image deleted successfully');
            setEventImages([]);
            setPage(0);
            setHasMore(true);
        } catch (err) {
            alert(err.message);
        } finally {
            setShowModal(false);
            setIsViewerOpen(false);
            setImageToDelete(null);
            document.body.style.overflow = 'auto'; // Re-enable scroll after deletion
        }
    };

    const closeModal = () => {
        setShowModal(false);
        document.body.style.overflow = 'auto'; // Re-enable scroll on modal close
    };

    const handleModalDelete = (image, currentImageIndex) => {
        setImageToDelete(currentImageIndex);
        setShowModal(true);
        document.body.style.overflow = 'hidden'; // Disable scroll on modal open
    };

    const handleOutsideClick = (e) => {
        if (e.target === e.currentTarget) {
            closeModal();
        }
    };

    useEffect(() => {
        return () => {
            document.body.style.overflow = 'auto'; // Clean up on unmount
        };
    }, []);

    if (error) {
        return <div className="container mt-5 alert alert-danger"><h2>{error}</h2></div>;
    }

    return (
        <div className="container mt-5 position-relative">
            <div style={{ minHeight: userLoginStatus ? '50px' : '0px' }}>
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
                                ref={isLastImage ? lastImageRef : null}
                                className="col-lg-2 col-md-3 col-sm-6 col-12 mb-4 gallerycol"
                                onClick={() => handleImageClick(index)}
                            >
                                <div className="gallery-item">
                                    <img 
                                        src={imageData} 
                                        className="img-thumbnail gallery-image" 
                                        alt="event" 
                                    />
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <div className="container mt-5 alert alert-danger">
                        <h2>No images available for this event</h2>
                    </div>
                )}
                {loading && (
                    <div className="col-12 text-center">
                        <div className="spinner-border" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                    </div>
                )}
            </div>

            {/* Modal */}
            {showModal && (
                <div className="modal-overlay" onClick={handleOutsideClick}>
                    <div className="modal-content">
                        <h3>Are you sure you want to delete this image?</h3>
                        <div className="modal-buttons">
                            <button className="btn btn-danger me-2" onClick={handleDeleteImage}>Delete</button>
                            <button className="btn btn-secondary" onClick={closeModal}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Image Viewer */}
            {isViewerOpen && currentImageIndex !== null && (
                <div className="image-viewer" onClick={handleCloseViewer}>
                    <button
                        className="btn-close position-absolute top-0 start-0 ms-2 mt-2 text-white"
                        onClick={handleCloseViewer}
                    >
                        <ImCross />
                    </button>
                    <img
                        src={eventImages[currentImageIndex]}
                        alt="event"
                        className="img-fluid image-viewer-img"
                        onTouchStart={handleTouchStart}
                        onTouchEnd={handleTouchEnd}
                    />
                    <div className="position-absolute top-50 start-0 ms-3" onClick={handlePrevImage}>
                        <span className="carousel-control-prev-icon"></span>
                    </div>
                    <div className="position-absolute top-50 end-0 me-3" onClick={handleNextImage}>
                        <span className="carousel-control-next-icon"></span>
                    </div>
                    {userLoginStatus && (
                        <>
                            <button
                                className="btn position-absolute bottom-0 start-0 ms-3 mb-3"
                                onClick={(e) => {
                                    e.stopPropagation(); // Prevent closing the viewer
                                    handleModalDelete(eventImages[currentImageIndex], currentImageIndex);
                                }}
                            >
                                <RiDeleteBin6Line />
                            </button>
                            <a
                                href={eventImages[currentImageIndex]}
                                download
                                className="btn position-absolute bottom-0 end-0 me-3 mb-3"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <MdDownload />
                            </a>
                        </>
                    )}
                </div>
            )}
        </div>
    );
}

export default Gallery;
