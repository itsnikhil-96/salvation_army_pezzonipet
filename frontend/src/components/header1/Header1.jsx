import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Import useNavigate
import { TfiMenu } from 'react-icons/tfi';
import { userLoginContext } from '../../components/contexts/userLoginContext';
import { useContext } from 'react';
import logoa from '../../../photos/logo2.png';
import logob from '../../../photos/saylogo5.png';
import './Header1.css';

function Header1() {
  const { logoutUser, userLoginStatus, currentUser } = useContext(userLoginContext);
  const [collapseOpen, setCollapseOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navbarRef = useRef(null);
  const navigate = useNavigate(); 

  const handleOutsideClick = (event) => {
    if (navbarRef.current && !navbarRef.current.contains(event.target)) {
      setDropdownOpen(false);
      setCollapseOpen(false);
    }
  };

  const toggleCollapse = () => {
    setCollapseOpen(!collapseOpen);
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
    setCollapseOpen(false);
  };

  const handleLinkClick = () => {
    setDropdownOpen(false);
    setCollapseOpen(false);
  };

  const handleLogout = () => {
    logoutUser(); 
    navigate('/home');
  };

  useEffect(() => {
    document.addEventListener('click', handleOutsideClick);
    return () => {
      document.removeEventListener('click', handleOutsideClick);
    };
  }, []);

  return (
    <div className='header1 pt-2'>
      <div className='row mainsay d-flex flex-wrap'>
        <div className='col-md-0 col-sm-0 col-0 d-none col-lg-1 d-lg-block text-center mt-2 removedpic'>
          <img src={logob} alt='Logo' className='logob' />
        </div>
        <div className='col-lg-10 col-md-10 col-sm-10 col-10 row mainrow'>
          <div className='col-lg-12 col-md-9 col-sm-10 col-10 titlename text-center'>
            <p className='logoname'>The Salvation Army Pezzonipet Corps</p>
          </div>
          <div className='col-lg-12 col-md-3 col-sm-2 col-2 '>
            <div className=' text-center button-toggle '>
              <nav className='navbar navbar-expand-lg'>
                <div className='container-fluid' ref={navbarRef}>
                  <button
                    className='navbar-toggler button1'
                    type='button'
                    onClick={toggleCollapse}
                    aria-controls='navbarSupportedContent'
                    aria-expanded={collapseOpen ? 'true' : 'false'}
                    aria-label='Toggle navigation'
                  >
                    <span className='icon text-dark'>
                      <TfiMenu />
                    </span>
                  </button>
                  <div className={`collapse navbar-collapse ${collapseOpen ? 'show' : ''}`} id='navbarSupportedContent'>
                    <ul className='navbar-nav mt-2 mb-1 mb-lg-0'>
                      <li className='nav-item'>
                        <Link to='/home' className='nav-link links' onClick={handleLinkClick}>
                          Home
                        </Link>
                      </li>
                      <li className='nav-item'>
                        <Link to='/aboutus' className='nav-link links' onClick={handleLinkClick}>
                          About Us
                        </Link>
                      </li>
                      <li className='nav-item'>
                        <Link to='/doctrines' className='nav-link links' onClick={handleLinkClick}>
                          Doctrines
                        </Link>
                      </li>
                      <li className='nav-item'>
                        <Link to='/photogallery' className='nav-link links' onClick={handleLinkClick}>
                          Gallery
                        </Link>
                      </li>
                      <li className='nav-item'>
                        <Link to='/news' className='nav-link links' onClick={handleLinkClick}>
                          Events
                        </Link>
                      </li>
                      <li className='nav-item'>
                        <Link to='/officers' className='nav-link links' onClick={handleLinkClick}>
                          Officers
                        </Link>
                      </li>
                      {userLoginStatus === false ? (
                        <li className='nav-item'>
                          <Link to='login' className='nav-link links'>
                            Login
                          </Link>
                        </li>
                      ) : (
                        <li className='nav-item dropdown'>
                          <span
                            className='nav-link links dropdown-toggle'
                            role='button'
                            id='navbarDropdown'
                            onClick={toggleDropdown}
                            aria-expanded={dropdownOpen ? 'true' : 'false'}
                          >
                            {currentUser.username}
                          </span>
                          <ul className={`dropdown-menu ${dropdownOpen ? 'show' : ''}`} aria-labelledby='navbarDropdown'>
                            <li>
                              <Link to='/editprofile' className='dropdown-item' onClick={handleLinkClick}>
                                Edit Profile
                              </Link>
                            </li>
                            <li>
                              <Link to='/addevent' className='dropdown-item' onClick={handleLinkClick}>
                                Add Event
                              </Link>
                            </li>
                            <li>
                              <span className='dropdown-item' onClick={handleLogout}>
                                Logout
                              </span>
                            </li>
                          </ul>
                        </li>
                      )}
                    </ul>
                  </div>
                </div>
              </nav>
            </div>
          </div>
        </div>

        <div className='col-lg-1 col-md-2 col-sm-2 col-2 text-center imgdiv'>
          <img src={logoa} alt='Logo' className='logoa' />
        </div>
      </div>
    </div>
  );
}

export default Header1;
