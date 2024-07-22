import React from 'react'
import chruchlogo from '../../../photos/chruchlogo.jpg';
import './Home.css';
function Home() {
  return (
    <div>
      <div className='home-container'>
      <div className='row mt-4 home-row m-3 slide-from-left'>
        <div className='col-lg-9'>
            <h3 className='text-center prayer-heading'>Prayer Timings</h3>
            <div className='prayer-timings'>
              <p><b className='home-heading'>Sunday School :</b> Every Sunday 7:30AM to 9:00AM</p>
              <p><b className='home-heading'>Sunday Worship :</b> Every Sunday 9:30AM to 12:30PM</p>
              <p><b className='home-heading'>Home League Meeting :</b> Every Wednesday 2:00PM to 5:00PM</p>
              <p><b className='home-heading'>Fasting Prayer :</b> Every Friday 7:30PM to 9:00PM</p>
              <p><b className='home-heading'>Youth Meeting :</b> Every Sunday : 6:30PM to 8:30PM</p>
              </div>
        </div>
        <div className='col-lg-3 text-center'>
           <img src={chruchlogo} className='churchlogo'></img>
        </div>
      </div>
      <div className='slide-from-right'>
        <h3 className='heading text-center'>History of Salvation Army Pezzonipet</h3>

      </div>
      </div>
    </div>
  )
}

export default Home