//import React from 'react';
//import ReactDOM from 'react-dom';
//import App from './App';

//ReactDOM.render(<App />, document.getElementById('root'));

import React from 'react';
import ReactDOM from 'react-dom';
import { createStore } from 'redux';
import { Provider } from 'react-redux';

import App from './App';
import 'bootstrap/dist/css/bootstrap-grid.css';
import 'react-toastify/dist/ReactToastify.css';
import './index.scss'
import reminders from "./Reducers/reducerReminder";

const store = createStore(
  reminders,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

ReactDOM.render(
  <Provider store={ store }>
    <App />
  </Provider>
  , document.getElementById('root'));
