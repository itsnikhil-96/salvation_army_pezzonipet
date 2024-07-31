import React from 'react';
import pic11 from '../../../photos/slides/sundayschoolslide.jpg';
import pic12 from '../../../photos/slides/sundayworshipslide.jpg';
import pic13 from '../../../photos/slides/homeleagueslide.jpg';
import pic14 from '../../../photos/slides/fastingprayerslide.jpg';
import pic15 from '../../../photos/slides/youthmeetingslide.jpg';
import pic16 from '../../../photos/slides/allnightprayer.jpg';

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
    <div className='history'>
         <h3 className='mt-3 fs-3 text-center heading'>History of Salvation Army Pezzonipet-Corps</h3>
         <p className='english'>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Doloremque, quas perferendis soluta tenetur blanditiis maxime commodi doloribus molestias quidem minus eos labore adipisci culpa eius? Corporis, animi. Magnam dolorum iure, reprehenderit odit cupiditate magni molestiae. Unde blanditiis soluta, doloremque aspernatur tempore magni rerum sapiente sit voluptatem at. Nam iure praesentium eius delectus eligendi cupiditate similique dolorum ut enim exercitationem, eveniet tempore, quos maiores reiciendis ipsum. Numquam iure accusamus placeat optio modi saepe, possimus quis odio ducimus unde laborum fugit ex blanditiis voluptatibus voluptate expedita excepturi animi officia fuga laboriosam facere ipsa vitae magnam. Soluta debitis laborum, praesentium voluptas illum neque.</p>
         <p className='english'>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Doloremque, quas perferendis soluta tenetur blanditiis maxime commodi doloribus molestias quidem minus eos labore adipisci culpa eius? Corporis, animi. Magnam dolorum iure, reprehenderit odit cupiditate magni molestiae. Unde blanditiis soluta, doloremque aspernatur tempore magni rerum sapiente sit voluptatem at. Nam iure praesentium eius delectus eligendi cupiditate similique dolorum ut enim exercitationem, eveniet tempore, quos maiores reiciendis ipsum. Numquam iure accusamus placeat optio modi saepe, possimus quis odio ducimus unde laborum fugit ex blanditiis voluptatibus voluptate expedita excepturi animi officia fuga laboriosam facere ipsa vitae magnam. Soluta debitis laborum, praesentium voluptas illum neque.</p>
         <p className='english'>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Doloremque, quas perferendis soluta tenetur blanditiis maxime commodi doloribus molestias quidem minus eos labore adipisci culpa eius? Corporis, animi. Magnam dolorum iure, reprehenderit odit cupiditate magni molestiae. Unde blanditiis soluta, doloremque aspernatur tempore magni rerum sapiente sit voluptatem at. Nam iure praesentium eius delectus eligendi cupiditate similique dolorum ut enim exercitationem, eveniet tempore, quos maiores reiciendis ipsum. Numquam iure accusamus placeat optio modi saepe, possimus quis odio ducimus unde laborum fugit ex blanditiis voluptatibus voluptate expedita excepturi animi officia fuga laboriosam facere ipsa vitae magnam. Soluta debitis laborum, praesentium voluptas illum neque.</p>
         <p className='english'>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Doloremque, quas perferendis soluta tenetur blanditiis maxime commodi doloribus molestias quidem minus eos labore adipisci culpa eius? Corporis, animi. Magnam dolorum iure, reprehenderit odit cupiditate magni molestiae. Unde blanditiis soluta, doloremque aspernatur tempore magni rerum sapiente sit voluptatem at. Nam iure praesentium eius delectus eligendi cupiditate similique dolorum ut enim exercitationem, eveniet tempore, quos maiores reiciendis ipsum. Numquam iure accusamus placeat optio modi saepe, possimus quis odio ducimus unde laborum fugit ex blanditiis voluptatibus voluptate expedita excepturi animi officia fuga laboriosam facere ipsa vitae magnam. Soluta debitis laborum, praesentium voluptas illum neque.</p>

    </div>
    </div>
  );
}

export default Home1;
