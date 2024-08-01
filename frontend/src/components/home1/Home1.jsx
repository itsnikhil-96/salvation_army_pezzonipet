import React from 'react';
import pic11 from '../../../photos/slides/sundayschoolslide.jpg';
import pic12 from '../../../photos/slides/sundayworshipslide.jpg';
import pic13 from '../../../photos/slides/homeleagueslide.jpg';
import pic14 from '../../../photos/slides/fastingprayerslide.jpg';
import pic15 from '../../../photos/slides/youthmeetingslide.jpg';
import pic16 from '../../../photos/slides/allnightprayer.jpg';
import logo from '../../../photos/newchruch logo.jpeg';

import './Home1.css';

function Home1() {
  return (
    <div>
    <div id="carouselExample" className="carousel slide mt-4" data-bs-ride="carousel">
      <div className="carousel-inner">
        <div className="carousel-item active">
          <img src={pic11} className="d-block w-100 carousel-img" alt="Sunday School" />
        </div>
        <div className="carousel-item">
          <img src={pic12} className="d-block w-100 carousel-img" alt="Sunday Worship" />
        </div>
        <div className="carousel-item">
          <img src={pic13} className="d-block w-100 carousel-img" alt="Home League" />
        </div>
        <div className="carousel-item">
          <img src={pic14} className="d-block w-100 carousel-img" alt="Fasting Prayer" />
        </div>
        <div className="carousel-item">
          <img src={pic15} className="d-block w-100 carousel-img" alt="Youth Meeting" />
        </div>
        <div className="carousel-item">
          <img src={pic16} className="d-block w-100 carousel-img" alt="All Night Prayer" />
        </div>
      </div>
      <button className="carousel-control-prev" type="button" data-bs-target="#carouselExample" data-bs-slide="prev">
        <span className="carousel-control-prev-icon" aria-hidden="true"></span>
        <span className="visually-hidden">Previous</span>
      </button>
      <button className="carousel-control-next" type="button" data-bs-target="#carouselExample" data-bs-slide="next">
        <span className="carousel-control-next-icon" aria-hidden="true"></span>
        <span className="visually-hidden">Next</span>
      </button>
    </div>
    <div className='history my-5'>
         <h3 className='mb-5 fs-3 text-center heading'>History of Salvation Army Pezzonipet-Corps</h3>
         <div className='row'>
    <div className='col-12 col-sm-12 col-md-8 col-lg-9'>
        <div className='english'>
        <p>The Salvation Army is a Christian Chruch and international charitable organization founded by <b>William Booth</b> and his <b>wife Catherine</b> in the year 1865.
              It was first named as East London Christian Mission.It's headquarter's in London, England.In 1878. Booth reorganized the mission, becoming its first general and introducing the military structure, which it has retained as a matter of tradition.
              Salvation Army has 9 hospitals and more than 100 schools in India.Its national secretariat is in Kolkata, West Bengal.
          </p>
          <p>
          The Salvation Army is driven by spiritual principles that manifest practically through evangelical, social, educational, and healthcare initiatives. 
          Its mission is to guide individuals towards a fulfilling life in connection with Christ, as revealed in the Scriptures, and exemplified through righteous living in unity and peace with others.
          </p>   
          <p>Some Salvationists become local officers or spiritual leaders within their corps and they will be having their seperate duties which are to be 
            performed by them. Every event is coordinated by them and they serve as the backbone of organization.
          </p>  
       </div>
    </div>
    <div className='col-12 col-sm-12 col-md-4 col-lg-3 text-center'>
        <img src={logo}  className='chruchlogo' alt='Description of the image' />
    </div>
</div>

    </div>
    </div>
  );
}

export default Home1;
