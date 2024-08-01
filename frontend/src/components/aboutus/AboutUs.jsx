import React from 'react';
import churchlocation from '../../../photos/chruchlocation.jpeg';
import pic11 from '../../../photos/founderlogo.jpg';
import './AboutUs.css';

function AboutUs() {
  return (
    <div className='about mt-3'>
      <div className='english'>
          <p>
            The Salvation Army is a Christian Church and international charitable organization founded by 
            <b> William Booth</b> and his <b>wife Catherine</b> in the year 1865. It was first named as East London Christian Mission. 
            Its headquarters are in London, England. In 1878, Booth reorganized the mission, becoming its first general and introducing 
            the military structure, which it has retained as a matter of tradition.
          </p>
          <img src={pic11} className='right-image' alt='Youth Meeting' />
          <p>
            The Salvation Army has 9 hospitals and more than 100 schools in India. Its national secretariat is in Kolkata, West Bengal. 
            The Salvation Army is driven by spiritual principles that manifest practically through evangelical, social, educational, 
            and healthcare initiatives. 
          </p>
          <p>
            Its mission is to guide individuals towards a fulfilling life in connection with Christ, as revealed in the Scriptures, 
            and exemplified through righteous living in unity and peace with others.
          </p>
          <p><b>Importance of Women in Salvation Army</b></p>
          <p>
            "I insist on the equality of women with men. Every officer and soldier should insist upon the truth that woman is as important, 
            as valuable, as capable and as necessary to the progress and happiness of the world as man. Unfortunately a large number of 
            people of every tribe, class and nationality think otherwise. They still believe woman is inferior to man." These are the words 
            of William Booth in his Messages to Soldiers, a book published in Britain in 1908. This shows the Gender Equality in the church 
            from 1878 itself.
          </p>
          <p><b>Importance of Local Officers in Salvation Army</b></p>
          <p>
            Some Salvationists become local officers or spiritual leaders within their corps and they have their separate duties which 
            are to be performed by them. Every event is coordinated by them and they serve as the backbone of the organization.
          </p>
      </div>
      <h5 className='mt-3'><b className='english'>Location:</b></h5>
      <a href='https://maps.app.goo.gl/Va51RnYwgVhkXJF76'>
        <img src={churchlocation} className='mt-2 church-location-img' alt='Church Location' />
      </a>
    </div>
  );
}

export default AboutUs;
