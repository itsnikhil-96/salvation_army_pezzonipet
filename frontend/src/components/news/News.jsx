import React from 'react';
import './News.css';
import { IoMdArrowDropdown } from 'react-icons/io';
import { Link } from 'react-router-dom';

function News() {
  const events = [
    { name: 'YP Annual 2024', url: 'yp-annual-2024' },
    { name: 'VBS 2024', url: 'vbs-2024' },
    { name: 'Christmas 2024',url: 'christmas-2024' },
    { name: 'New Year 2024', url: 'new-year-2024' },
    { name: 'Good Friday 2024', url: 'good-friday-2024' },
    { name: 'Easter 2024', url: 'easter-2024' },
  ];

  return (
    <div className='row p-3'>
      {events.map((event, index) => (
        <div className='col-12 newitem mb-3' key={index}>
          <div className='row'>
            <div className='col-lg-10'><p>{event.name}</p></div>
            <div className='col-lg-2'>
              <Link to={`/gallery/${event.url}`}><IoMdArrowDropdown /> View Gallery</Link>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default News;
