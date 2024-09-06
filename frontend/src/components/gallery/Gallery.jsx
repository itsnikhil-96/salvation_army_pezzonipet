import React, { useState, useEffect, useContext, useRef } from 'react';
import { useParams } from 'react-router-dom';
import './Gallery.css';
import { MdDownload } from "react-icons/md";
import { ImCross } from "react-icons/im";
import { userLoginContext } from '../contexts/userLoginContext';

function Gallery() {
    const { userLoginStatus } = useContext(userLoginContext);  // To add additional pics for checking condition
    const { eventname } = useParams();    // For displaying on top
    const [eventImages, setEventImages] = useState([]); // Storing images
    const [page, setPage] = useState(0);  // For no of pages ( Lazy Loading )
    const [hasMore, setHasMore] = useState(true);  // To check whether there are more images to load
    const [loading, setLoading] = useState(false); //Lazy loading state
    const [error, setError] = useState(null);  // Errors
    const [selectedFiles, setSelectedFiles] = useState([]);  //while uploading storing images in that array
    const [isUploading, setIsUploading] = useState(false);  //Same state for button ( conditional rendering)
    const [isViewerOpen, setIsViewerOpen] = useState(false);  //Full screen
    const [currentImageIndex, setCurrentImageIndex] = useState(null);  //For display of current image only

    const limit = 3;  // No of images to fetch per page

    const observer = useRef();  // Reference to the intersection observer
    const lastImageRef = useRef();  // Reference to the last image element

    useEffect(() => {
        const fetchImages = async () => {

            setLoading(true); // starts loading images

            try {
                // skip=${page * limit } will skip the already loaded data
                // limit will fetch only 3 images for one fetch reducing API load
                const res = await fetch(`https://salvation-army-pezzonipet-gn1u.vercel.app/event-api/events/${eventname}?skip=${page * limit}&limit=${limit}`);
                if (!res.ok) {
                    throw new Error('Event not found');
                }
                const data = await res.json();

                // At last if only 2 or less images came , there are no more images to load
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
    }, [eventname, page]);   // eventname is included because if we move to new event that event pics will be displayed 
                             //page is included because for every fetch page will increase so it should again fetch the data

    useEffect(() => {

        //If already images are being loaded dont load again if scroll or if there are no images no need to load
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
            setIsUploading(false);  // Hide uploading state
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

    const touchStartXRef = useRef(0);  // For touch events

    const handleTouchStart = (e) => {
        touchStartXRef.current = e.touches[0].clientX;  // Capture touch start position
    };
    
    const handleTouchEnd = (e) => {
        const touchEndX = e.changedTouches[0].clientX;
        const touchDiff = touchStartXRef.current - touchEndX;
    
        if (touchDiff > 50) {
            handleNextImage();  // Swipe left
        } else if (touchDiff < -50) {
            handlePrevImage();  // Swipe right
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

            {/* Full-Screen Image Viewer */}
            {isViewerOpen && eventImages.length > 0 && (
                <div className="full-screen-viewer" onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
                 <span className="delete fs-4 text-center position-absolute top-0 end-0 m-4" style={{ cursor: 'pointer' }}>
                     <ImCross className='mb-1 mx-2 p-1'/>
                 </span>
                    {currentImageIndex > 0 && (
                        <button className="prev-btn" onClick={handlePrevImage}>
                            &lt;
                        </button>
                    )}
                    {/* Download button */}
                    <a
                        href={eventImages[currentImageIndex]}
                        download={`image-${currentImageIndex + 1}.jpg`}
                        className="position-absolute top-0 start-0 m-4 download-btn fs-3"
                    >
                         <span className="" style={{ cursor: 'pointer' }}>
                            <MdDownload className='mb-1 mx-2'/>
                         </span>
                    </a>
                   
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
        </div>
    );
}

export default Gallery;
