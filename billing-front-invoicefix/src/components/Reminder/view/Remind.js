import React from 'react';
import { ToastContainer } from 'react-toastify';
import Inputs from "../inputs";
import View from "./index";


export default function Remind() {

    return (
      <div className="app">
        <div className="container">
          <h1>Reminder of all your Invoices</h1>
          <div className="row justify-content-center">
            <div className="col-auto">
              <Inputs />
            </div>
            <div className="col-auto" style={{width: "350px"}}>
              <View />
            </div>
          </div>
        </div>
        <ToastContainer pauseOnHover={false} />
      </div>
    )

}


