import React from 'react';
import '../App.css';
import { Button } from './Button';
import './Front.css';

function Front() {
  return (
    <div className='hero-container'>
      <video src='/videos/video-1.mp4' autoPlay loop muted />
      <h1>Easy invoicing online</h1>
      <p>Send invoices the easy way with Digital Rogue Wave - the user-friendly
        invoice software for entrepreneurs.</p>
      <div className='hero-btns'>
        <Button
          className='btns'
          buttonStyle='btn--outline'
          buttonSize='btn--large'
        >
          GET STARTED
        </Button>
        <Button
          className='btns'
          buttonStyle='btn--primary'
          buttonSize='btn--large'
          onClick={console.log('hey')}
        >
          WATCH TRAILER <i className='far fa-play-circle' />
        </Button>
      </div>
    </div>
  );
}

export default Front;
