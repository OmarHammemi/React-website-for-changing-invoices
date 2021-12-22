import React from 'react';
import './Front2.css';
import Front2Item from './Front2Item';

function Front2() {
  return (
    <div className='cards'>
      <h1>The simplest way to create and send invoices</h1>
      <div className='cards__container'>
        <div className='cards__wrapper'>
          <ul className='cards__items'>
            <Front2Item
              src='images/pic2.PNG'


              path='/services'
            />
          </ul>
          <ul className='cards__items'>
            <Front2Item
              src='images/pic3.PNG'
              text='Be more productive'
              label='Productivity'
              path='/services'
            />
            <Front2Item
              src='images/pic4.PNG'
              text='Get paid faster'
              label='Faster'
              path='/products'
            />
            <Front2Item
              src='images/pic5.PNG'
              text='Serve your customers better'
              label='Adrenaline'
              path='/sign-up'
            />
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Front2;
