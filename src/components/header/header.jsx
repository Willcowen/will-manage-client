import React from 'react';
import { Link } from 'react-router-dom';
import './styles.css';
import { ReactComponent as Logo } from './mylogo.svg';

export default function Header() {
  return (
    <header className='header'>
      <div className='logo'>
        <Logo height='60' width='60' />
      </div>
      <div>
        <h1 className='title'>will manage</h1>
      </div>
      <div className='nav'>
        <Link
          to='/'
          style={{ textDecoration: 'none', fontFamily: 'Space Grotesk' }}
        >
          Logout
        </Link>
      </div>
    </header>
  );
}
