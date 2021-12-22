import React, { useState, useEffect } from 'react';
import { Button } from './Button';
import { Link } from 'react-router-dom';
import './Navbar.css';
import Login from './login';
import {useHistory} from "react-router";

function Navbar() {
  const [click, setClick] = useState(false);
  console.log(localStorage.getItem('user') == null)
  const [button, setButton] = useState(true );
  const [loggedIn, setLoggedIn] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem('user') != null);
  const history = useHistory();
  const handleClick = () => setClick(!click);
  const closeMobileMenu = () => setClick(false);

  const showButton = () => {
    if (window.innerWidth <= 960) {
      setButton(false);
    } else {
      setButton(true);
    }
  };

  useEffect(() => {
    showButton();
  }, []);

  console.log(Login.loggedIn);

 const logout = ()=> {
   localStorage.removeItem('user')
   window.location.href="/login"
 }
  window.addEventListener('resize', showButton);

  return (
    
    <div>
      <nav className='navbar'>
        <div className='navbar-container'>
          <Link to='/' className='navbar-logo' onClick={closeMobileMenu}>
            Digital Rogue Wave
            <i className='fab fa-typo3' />
          </Link>
          <div className='menu-icon' onClick={handleClick}>
            <i className={click ? 'fas fa-times' : 'fas fa-bars'} />
          </div>
          <ul className={click ? 'nav-menu active' : 'nav-menu'}>
            <li className='nav-item'>
              <Link to='/' className='nav-links' onClick={closeMobileMenu}>
                Home
              </Link>
            </li>
            <li className='nav-item'>
              <Link
                to='/facture'
                className='nav-links'
                onClick={closeMobileMenu}
              >
                Invoice
              </Link>
            </li>

            <li className='nav-item'>
              <Link
                to='/reminders'
                className='nav-links'
                onClick={closeMobileMenu}
              >
                Reminders
              </Link>
            </li>

            <li className='nav-item'>
              <Link
                to='/myinvoices'
                className='nav-links'
                onClick={closeMobileMenu}
              >
                My Invoices
              </Link>
            </li>

            <li className='nav-item'>
              <Link
                to='/company'
                className='nav-links'
                onClick={closeMobileMenu}
              >
                Company
              </Link>
            </li>

            <li className='nav-item'>
              <Link
                to='/Profile'
                className='nav-links'
                onClick={closeMobileMenu}
              >
                My Profile
              </Link>
            </li>


            {/*<li className='nav-item'>*/}
            {/*  <Link*/}
            {/*    to='/services'*/}
            {/*    className='nav-links'*/}
            {/*    onClick={closeMobileMenu}*/}
            {/*  >*/}
            {/*    Support*/}
            {/*  </Link>*/}
            {/*</li>*/}
        {/*    <li className='nav-item'>
              <Link
                to='/products'
                className='nav-links'
                onClick={closeMobileMenu}
              >
                About us
              </Link>
            </li>
*/}
            { !Login.loggedIn ?
              <li>
                <Link
                  to='/login'
                  className='nav-links-mobile'
                  onClick={closeMobileMenu}
                >
                  Login
                </Link>
              </li>: <p>Logged In</p>
            }

          </ul>

          {!isLoggedIn  && <Button buttonStyle='btn--outline'>LOGIN {isLoggedIn}</Button>}
          {isLoggedIn  && <Button onClick={logout} buttonStyle='btn--outline'>LOGOUT </Button>}
        </div>
      </nav>
    </div>
  );
}

export default Navbar;
