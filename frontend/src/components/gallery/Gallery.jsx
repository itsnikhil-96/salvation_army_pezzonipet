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
                const res = await fetch(`https://salvation-army-pezzonipet-gn1u.vercel.app/event-api/events/event/${eventname}?skip=${page * limit}&limit=${limit}`);
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
            setEventImages((prevImages) => [ ...prevImages, ...data.payload.images ]);
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
    };

    const handleCloseViewer = () => {
        setIsViewerOpen(false);
        setCurrentImageIndex(null);
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
            setEventImages((prevImages) => prevImages.filter(image => image !== imageToDelete));
            alert('Image deleted successfully');
            setEventImages([]);
            setPage(0);
            
        } catch (err) {
            alert(err.message);
        } finally {
            setShowModal(false);
            setImageToDelete(null);
        }
    };

    const closeModal = () => {
        setShowModal(false);
    };

    const handleModalDelete = (image,currentImageIndex) => {
        console.log(currentImageIndex)
        setImageToDelete(currentImageIndex);
        setShowModal(true);
    };

    const handleOutsideClick = (e) => {
        if (e.target === e.currentTarget) {
            closeModal();
        }
    };

    if (error) {
        return <div className="container mt-5 alert alert-danger"><h2>{error}</h2></div>;
    }

    return (
        <div className="container mt-4 position-relative">
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
            <div className='scrolling english'>Click on any specific pic to view it on full screen</div>
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
                                        className="galleryimg" 
                                        alt={`Gallery for ${eventname}`} 
                                    />
                                </div>
                            </div>
                        );
                    })
                ) : (
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

            {isViewerOpen && eventImages.length > 0 && (
                <div className="full-screen-viewer" onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
                 <span className="delete fs-4 text-center position-absolute top-0 end-0 m-4" style={{ cursor: 'pointer' }} onClick={handleCloseViewer}>
                     <ImCross className='mb-1 mx-2 p-1'/>
                 </span>
                    {currentImageIndex > 0 && (
                        <button className="prev-btn" onClick={handlePrevImage}>
                            &lt;
                        </button>
                    )}
                    <div className='position-absolute top-0 start-0 m-4 '>
                        <a
                            href={eventImages[currentImageIndex]}
                            download={`image-${currentImageIndex + 1}.jpg`}
                            className="download-btn fs-3"
                        >
                            <span className="" style={{ cursor: 'pointer' }}>
                                <MdDownload className='mb-1 mx-2'/>
                            </span>
                        </a>
                        {userLoginStatus && (
                            <span 
                                className="delete fs-3" 
                                style={{ cursor: 'pointer' }} 
                                onClick={() => handleModalDelete(eventImages[currentImageIndex],currentImageIndex)}
                            >
                                <RiDeleteBin6Line className='mb-1 mx-2 deletebutton'/>
                            </span>
                        )}

                    </div>
                    <img
                        src={eventImages[currentImageIndex]}
                        alt={`Gallery for ${eventname}`}
                        className="full-screen-image"
                    />
                    {currentImageIndex < eventImages.length - 1 && (
                        <button className="next-btn" onClick={handleNextImage}>
                            &gt;
                        </button>
                    )}
                </div>
            )}

            {/* Modal for Delete Confirmation */}
            {showModal && (
                <div className="modal show" style={{ display: 'block' }} tabIndex="-1" role="dialog" onClick={handleOutsideClick}>
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Confirm Deletion</h5>
                                <button type="button" className="close btn btn-danger px-2 py-0" onClick={closeModal}>
                                    <span className='fs-4'>&times;</span>
                                </button>
                            </div>
                            <div className="modal-body">
                                <p>Do you really want to delete this image?</p>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={closeModal}>Cancel</button>
                                <button type="button" className="btn btn-danger" onClick={handleDeleteImage}>Delete</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Gallery;
