import React from 'react';
import pic11 from '../../../photos/slides/sundayschoolslide.jpg'
import pic12 from '../../../photos/slides/sundayworshipslide.jpg'
import pic13 from '../../../photos/slides/homeleagueslide.jpg'
import pic14 from '../../../photos/slides/fastingprayerslide.jpg'
import pic15 from '../../../photos/slides/youthmeetingslide.jpg'
import pic16 from '../../../photos/slides/allnightprayer.jpg'


import './Home1.css';

function Home1() {
  return (
    <div>
      <div id="carouselExampleIndicators" className="carousel slide mt-4" data-bs-ride="carousel" data-bs-interval="3000">
        <div className="carousel-indicators">
          <button
            type="button"
            data-bs-target="#carouselExampleIndicators"
            data-bs-slide-to="0"
            className="active"
            aria-current="true"
            aria-label="Slide 1"
          ></button>
          <button
            type="button"
            data-bs-target="#carouselExampleIndicators"
            data-bs-slide-to="1"
            aria-label="Slide 2"
          ></button>
          <button
            type="button"
            data-bs-target="#carouselExampleIndicators"
            data-bs-slide-to="2"
            aria-label="Slide 3"
          ></button>
           <button
            type="button"
            data-bs-target="#carouselExampleIndicators"
            data-bs-slide-to="3"
            aria-label="Slide 4"
          ></button>
           <button
            type="button"
            data-bs-target="#carouselExampleIndicators"
            data-bs-slide-to="4"
            aria-label="Slide 5"
          ></button>
           <button
            type="button"
            data-bs-target="#carouselExampleIndicators"
            data-bs-slide-to="5"
            aria-label="Slide 6"
          ></button>
        </div>
        <div className="carousel-inner">
          <div className="carousel-item active">
              <img src={pic11} className="d-block w-100 carousel-img" alt="Sunday School" />
          </div>
          <div className="carousel-item">
              <img src={pic12} className="d-block w-100 carousel-img" alt="Sunday Worship" />
          </div>
          <div className="carousel-item ">
              <img src={pic13} className="d-block w-100 carousel-img" alt="Home League" />
          </div>
            <div className="carousel-item">
              <img src={pic14} className="d-block w-100 carousel-img" alt="Fasting Prayer" />
          </div>
          <div className="carousel-item">
              <img src={pic15} className="d-block w-100 carousel-img" alt="Youth Meeting" />
            </div>
            <div className="carousel-item ">
              <img src={pic16} className="d-block w-100 carousel-img" alt="All Night Prayer" />
            </div>   
        </div>
        <button
          className="carousel-control-prev"
          type="button"
          data-bs-target="#carouselExampleIndicators"
          data-bs-slide="prev"
        >
          <span className="carousel-control-prev-icon" aria-hidden="true"></span>
          <span className="visually-hidden">Previous</span>
        </button>
        <button
          className="carousel-control-next"
          type="button"
          data-bs-target="#carouselExampleIndicators"
          data-bs-slide="next"
        >
          <span className="carousel-control-next-icon" aria-hidden="true"></span>
          <span className="visually-hidden">Next</span>
        </button>
      </div>
    </div>
  );
}

export default Home1;
