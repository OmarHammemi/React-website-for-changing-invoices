import React, { useState } from 'react';
import Navbar from './components/Navbar';
import './App.css';
import Home from './components/pages/Home';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Services from './components/pages/Services';
import Products from './components/pages/Products';
import SignUp from './components/pages/SignUp';
import Login from './components/login';

import useToken from './useToken';

import Invoice from './components/Invoice/Invoice';


import Remind from "./components/Reminder/view/Remind";
import Company from "./components/Company/Company";
import User from "./components/Profil/Profile";
import MyInvoice from "./components/Myinvoices/MyInvoice"
import Invoiceview from "./components/Myinvoices/Invoiceview";
import Currency from "./components/converter/Currency"




function App() {

  return (
    <div>
      <Router>

        <Navbar />
        <Switch>
          <Route path='/' exact component={Home} />
          <Route path='/services' component={Services} />
          <Route path='/reminders' component={Remind} />
          <Route path='/company' component={Company} />
          <Route path='/login' component={Login} />
          <Route path='/myinvoices' component={MyInvoice} />
          <Route path='/Invoiceview' component={Invoiceview} />
          <Route path='/profile' component={User} />
          <Route path='/currency' component={Currency} />
          <Route path='/facture' component={Invoice} />
          <Route path='/sign-up' component={SignUp} />
        </Switch>
      </Router>
    </div>
  );
}

export default App;
