import './Officers.css';
import { IoCall } from "react-icons/io5";
import { LiaWhatsapp } from "react-icons/lia";
import pastorgaru from '../../../photos/pastorgaru.jpeg';
import pastorammagaru from '../../../photos/pastorammagaru.jpeg';
import navvenanna from '../../../photos/naveenanna.jpeg';
import vijayanna from '../../../photos/vijayanna.jpeg';
import yanishanna from '../../../photos/yanishanna.jpeg';
import anushaakka from '../../../photos/anushaakka.jpeg';
import kasturiaunty from '../../../photos/kasturi-aunty.jpeg';
import kumariaunty from '../../../photos/kumari-aunty.jpeg';
import manjulammaaunty from '../../../photos/manjulamm-aunty.jpeg';
import sarojanammaaunty from '../../../photos/sarojanamma-aunty.jpeg'

function Officers() {
  let officers=[
    {
      name: 'Major Saddu Sundar Singh',
      post: 'Pastor',
      phno: +919499014387,
      image: pastorgaru
    },
    {
      name: 'Major Koteswarama',
      post: 'Pastor',
      phno: +919499014387,
      image: pastorammagaru
    }
  ]
  let localofficers = [
    {
      name: 'Ch. Naveen',
      post: 'CSM',
      phno:  +919247442872,
      image: navvenanna
    },
    {
      name: 'Ch. Yanish Kumar',
      post: 'Secretary',
      phno: +918106374201,
      image: yanishanna
    },
    {
      name: 'Vijay',
      post: 'Treasurer',
      phno: +919705202262,
      image: vijayanna
    },
   
    {
      name: 'P. Anusha',
      post: 'YPSM',
      phno: +917989012504,
      image: anushaakka
    },
    {
      name: 'Ch.Manjula aunty',
      post: 'Home League Secretary',
      phno: +918106374201,
      image: manjulammaaunty
    },
    {
      name: 'Sarojanamma',
      post: 'Home League Tresurer',
      phno: +918106374201,
      image: sarojanammaaunty
    },
    {
      name: 'Kumari Aunty',
      post: 'League of Mercy Secretary',
      phno: +917993154789,
      image: kumariaunty
    },
    {
      name: 'Kasturi',
      post: 'League of Mercy Tresurer',
      phno: +918790709985,
      image: kasturiaunty
    },
  ];

  const handleWhatsApp = (phno) => {
    window.open(`https://wa.me/${phno}`, '_blank');
  };

  const handleCall = (phno) => {
    window.open(`tel:${phno}`, '_blank');
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">The Officers of Salvation Army - Pezzonipet Corps</h2>
      <div className="row row-cols-1 row-cols-sm-2 row-cols-md-1 row-cols-lg-2">
        {/* Render the officers */}
        {officers.map((officer, index) => (
          <div key={index} className="col mb-2 officersdiv">
            <div className="card mb-3 shadow-sm">
              <div className="row no-gutters">
                <div className="col-md-4">
                  <img src={officer.image} className="card-img" alt={officer.name} />
                </div>
                <div className="card-body col-md-8">
                  <h5 className="card-title mb-1"><b>Name: </b>{officer.name}</h5>
                  <p className="card-text fs-5 mb-1"><b>Post:</b> {officer.post}</p>
                  <p className="card-text fs-5 "><b>Phone Number:</b> {officer.phno}</p>
                  <div>
                    <IoCall  className='call'onClick={() => handleCall(officer.phno)} />
                    <LiaWhatsapp  className='whatsapp' onClick={() => handleWhatsApp(officer.phno)}/>
                    
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <h2 className='text-center mb-4'>Local Officers-Pezzonipet Corps</h2>
      <div className="row row-cols-1 row-cols-sm-2 row-cols-md-1 row-cols-lg-2">
        {/* Render the officers */}
        {localofficers.map((officer, index) => (
          <div key={index} className="col mb-2 officersdiv h-100">
            <div className="card mb-3 shadow-sm">
              <div className="row no-gutters">
                <div className="col-md-4">
                  <img src={officer.image} className="card-img" alt={officer.name} />
                </div>
                <div className="card-body col-md-8">
                  <h5 className="card-title mb-1"><b>Name: </b>{officer.name}</h5>
                  <p className="card-text fs-5 mb-1"><b>Post:</b> {officer.post}</p>
                  <p className="card-text fs-5 "><b>Phone Number:</b> {officer.phno}</p>
                  <div>
                    <IoCall  className='call'onClick={() => handleCall(officer.phno)} />
                    <LiaWhatsapp  className='whatsapp' onClick={() => handleWhatsApp(officer.phno)}/>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Officers;
