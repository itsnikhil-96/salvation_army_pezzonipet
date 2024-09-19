import './Footer.css';
import { Link } from 'react-router-dom';
import { FaFacebookF } from "react-icons/fa";
import { FaInstagramSquare, FaYoutube } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

function Footer() {
  return (
     <div className='bg-dark'>
       <div className="row text-light d-flex flex-wrap footerrow">
      {/* First column - full width on small and medium, half width on large */}
      <div className="col-md-4 col-lg-4 footer">
        <p className='mt-4 fs-5 footername'>The Salvation Army - Pezzonipet Corps</p>
        <p>
          Address:<br></br>
          David Street ,Pezzonipet<br></br>
          Vijayawada, NTR District<br></br>
          Andhra Pradesh -52003
        </p>
      </div>
      <div className='col-md-4 col-lg-4 footer mt-4'>
        <p>Follow us on</p>
        <ul className="list-unstyled d-flex gap-3">
          <li>
            <a
              href="https://www.instagram.com/sapezzonipetcorps"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaInstagramSquare className=' fs-3 insta bg-white' />
            </a>
          </li>
          <li>
            <a
              href="https://www.youtube.com/PezzonipetCorps"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaYoutube className=' fs-3 utube bg-white' />
            </a>
          </li>
          <li>
            <a
              href="https://www.facebook.com/sapezzonipetcorps"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaFacebookF className=' fs-3 facebook bg-white' />
            </a>
          </li>
          <li>
            <a href="https://x.com/pezzonipetcorps" target="_blank" rel="noopener noreferrer">
              <FaXTwitter className='fs-3 twit bg-white' />
            </a>
          </li>
        </ul>
      </div>
      {/* Second column - full width on small and medium, half width on large */}
      <div className="col-md-4  col-lg-4 footer">
        <div className='mt-3 mb-3'>
          <p className='footer-links fs-3'>Quick Links</p>
          <Link to="/" className='text-decoration-none foot-link'>Home</Link><br />
          <Link to="/aboutus" className='text-decoration-none foot-link'>About Us</Link><br />
          <Link to='/doctrines' className='text-decoration-none foot-link'>Doctrines</Link><br />
          <Link to='/officers' className='text-decoration-none foot-link'>Officers</Link>
        </div>
      </div>
    </div>
     </div>
  );
}

export default Footer;