import React from 'react';
import chruchlogo from '../../../photos/chruchlogo.jpg';
import logoa from '../../../photos/logo2.png';
import logob from '../../../photos/saylogo5.png';
import './PhotoGallery.css'
    const images = [
        chruchlogo,
        logoa,
        logob,
        chruchlogo,
        logoa,
        logob,
        chruchlogo,
        logoa,
        logob,
        chruchlogo,
        logoa,
        logob,
        chruchlogo,
        chruchlogo,
        chruchlogo,
        chruchlogo,
        chruchlogo,
        chruchlogo,
        chruchlogo
  ]
  
function PhotoGallery() {
  return (
    <div>
        <h3 className='text-center heading mt-3 mb-3'>Gallery</h3>
        <div className='row'>
        <div className="image-grid col-12 col-sm-12 col-lg-12 col-md-12 container">
        {images.map((image, index) => (
          <img key={index} src={image} alt={`Image ${index + 1}`} className="gallery-image" />
        ))}
      </div>
       </div> 
    </div>
  )
}

export default PhotoGallery