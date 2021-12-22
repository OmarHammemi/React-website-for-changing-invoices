import React, {useEffect, useRef, useState} from 'react'
import { useMemo } from 'react'
import Select from 'react-select'
import styles from './Invoice.module.scss'
import { v4 as uuidv4 } from 'uuid';
import { jsPDF } from "jspdf";
import html2canvas from 'html2canvas';
import LineItems from '../LineItems/LineItems'
import Logo from './Logo';
//import {AppBar, FormControl, Paper, Tab, Tabs} from "@material-ui/core";
import { Tabs, Tab, Content } from "./tab";
import {async} from "rxjs";
import axios from 'axios'
import Dropdown from 'react-dropdown';
import 'react-dropdown/style.css';
import Clients from "../Data/Clients.json";
import Textarea from "react-textarea-autosize";
import "./style.css";
import emailjs from "emailjs-com";
import { message, Button, Space } from 'antd';

import { useDetectOutsideClick } from "./useDetectOutsideClick";
import PropTypes from "prop-types";




export default function Invoice ()  {

  function sendEmail(e) {
    e.preventDefault();
    emailjs.send('service_r8vtwbu', 'template_vk2f7x7',  { name:selected, number: invoiceno,total:calcGrandTotal(),duedate:invoiceduedate}, 'user_9fM2XZEVa88SRbATPz2hk',)
      .then((result) => {
        console.log(result.text);
      }, (error) => {
        console.log(error.text);
      });

  }

  const sendEmails = (data, r) => {
    alert(`Thank you for your message from ${data.email}`);
    const templateId = 'template_vk2f7x7';
    const serviceID = 'service_r8vtwbu';
    const userID = 'user_9fM2XZEVa88SRbATPz2hk';
    sendFeedback(serviceID, templateId, userID, { name:value, number: invoiceno,total:calcGrandTotal(),duedate:invoiceduedate})
    r.target.reset();
  }
  const sendFeedback = (serviceID, templateId, userID, variables) => {
    emailjs.send(
      serviceID, templateId, userID,
      variables
    ).then(res => {
      console.log('Email successfully sent!')
    })
      .catch(err => console.error('There has been an error.  Here some thoughts on the error that occured:', err))
  }

  const [company, setCompany] = useState([])

  const getCompany= () => {
    fetch(`${process.env.REACT_APP_API_URL}/company`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'x-business-name' : 'billings',
        "Accept":"application/json"
      },

    })
      .then(response => response.json())
      .then(company => setCompany(company))
      .catch(err => console.log(err))
  }

  useEffect(() => {
    getCompany()
  }, []);

  const locale = 'en-US'
  const currency = 'USD'
  const [invoiceno, setinvoiceno] = useState('');
  const [invoicedate, setinvoicdate] = useState('');
  const [invoiceduedate, setinvoicduedate] = useState('');
  const [taxRate, setTaxRate] = useState(0.00);
  const [value, setValue] = useState(0);
  const [activeTab, setActiveTab] = useState('1');
  const [ fileName, setFileName ] = useState('');
  const [ showQuantity, setShowQuantity] = useState(true);

  const toggleShowQuantity = () => {
    setShowQuantity(!showQuantity);
  }
  const [errors, setErrors] = useState([])
  const submitFormAdd = e => {
    e.preventDefault()
    fetch(`${process.env.REACT_APP_API_URL}/invoice`, {
      method: 'put',
      headers: {
        'Content-Type': 'application/json',
        'x-business-name' : 'billings',
        "Accept":"application/json",
        "Bearer": localStorage.getItem('user').token
      },
      body: JSON.stringify({
        invoiceno: invoiceno,
        description: "facture",
        taxrate: parseInt(taxRate),
        issuedate: invoicedate+"T00:00:00.000Z",
        duedate: invoiceduedate+"T00:00:00.000Z",
        note: "facture",
        taxamount: calcTaxTotal(),
        subtotal: calcLineItemsTotal(),
        total: calcGrandTotal(),
        itemId: 1,
        updatedAt: "2021-07-05T23:00:00.000Z",
        updatedBy: 14,
        createdAt: "2021-07-14T23:00:00.000Z",
        createdBy: 25,
        items:lineItems
      })
    })
      .then(response => response.json())
      .then(item => {
        if(Array.isArray(item)) {
          LineItems.props.addItemToState(item[0])
          LineItems.props.toggle()
        }

      })
      //.catch(err => setErrors(err.response.message))
      .catch(errors => {
        if (errors.response) {
          setErrors(errors.error.response._errors);
          console.log(errors.error.response._errors)
        }
      })

  }

  const submitDraftAdd = e => {
    e.preventDefault()
    fetch(`${process.env.REACT_APP_API_URL}/invoice/draft`, {
      method: 'put',
      headers: {
        'Content-Type': 'application/json',
        'x-business-name' : 'billings',
        "Accept":"application/json"
      },
      body: JSON.stringify({
        invoiceno: invoiceno,
        description: "facture",
        taxrate: parseInt(taxRate),
        issuedate: invoicedate+"T00:00:00.000Z",
        duedate: invoiceduedate+"T00:00:00.000Z",
        note: "facture",
        taxamount: calcTaxTotal(),
        subtotal: calcLineItemsTotal(),
        total: calcGrandTotal(),
        itemId: 1,
        updatedAt: "2021-07-05T23:00:00.000Z",
        updatedBy: 14,
        createdAt: "2021-07-14T23:00:00.000Z",
        createdBy: 25,
        items:lineItems
      })
    })
      .then(response => response.json())
      .then(item => {
        if(Array.isArray(item)) {
          LineItems.props.addItemToState(item[0])
          LineItems.props.toggle()
        }

      })
      //.catch(err => setErrors(err.response.message))
      .catch(errors => {
        if (errors.response) {
          setErrors(errors.error.response._errors);
          console.log(errors.error.response._errors)
        }
      })

  }

  const handletabChange = event => {
    const { onChange, value, onClick } = this.props;

    if (onChange) {
      onChange(event, value);
    }

    if (onClick) {
      onClick(event);
    }
  };
  //const   handletabChange = (value) => {
    //console.log("Tab is changing to ",value);
    //setValue(value.target.value);
  //};

  const [lineItems, setLineItems] = useState([
    {

      name: '',
      description: '',
      quantity: 1,
      price: 0.00,
    },
  ]);
  const [clients, setClients] = useState([
    {
      options: []

    },
  ]);



    const [file, setFile] = useState(null);

    const fileHandler = event => {
      console.log(event.target.files[0]);
      const { name } = event.target.files[0];
      let reader = new FileReader();
      reader.onload = function(e) {
        setFile(e.target.result);
      };
      reader.readAsDataURL(event.target.files[0]);
      setFileName(name);
    };


  function handleTaxChange(e) {
    setTaxRate(e.target.value);
  }
  const handleLineItemChange = (elementIndex) => (event) => {
    let newlineItems = lineItems.map((item, i) => {
      if (elementIndex !== i) return item
      return {...item, [event.target.name]: event.target.value}
    })
    //setInputs(inputs => ({...inputs,[lineItems]:lineItems}));
    setLineItems(newlineItems)

  }

  const handleAddLineItem = () => {
    setLineItems(lineItems.concat(
      [{  name: '',description: '', quantity: 1, price: 0.00 }]
    ))
  }

  const handleRemoveLineItem = (elementIndex) => () => {
    setLineItems(lineItems.filter((item, i) => {
      return elementIndex !== i
    }))
  }

  const handleReorderLineItems = (newLineItems) => {
    setLineItems(newLineItems);
  }

  const handleFocusSelect = (event) => {
    event.target.select()
  }

  const printDocument = () => {
    const input = document.getElementById('pdf');
    html2canvas(input, {
      ignoreElements: function (node) {
        return node.nodeName === 'IFRAME';
      }
    })
      .then((canvas) => {
        let imgWidth = 208;
        let imgHeight = canvas.height * imgWidth / canvas.width;
        const imgData = canvas.toDataURL('img/png');
        const pdf = new jsPDF('p', 'mm', 'a4');
        pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
        // pdf.output('dataurlnewwindow');
        pdf.save("download.pdf");
      })
    ;

  }

  const printPDF = () => {
    const domElement = document.getElementById("pdf");
    html2canvas(domElement, {
      onclone: document => {
        document.getElementById("pdf").style.visibility = "hidden";
      }
    }).then(canvas => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF();
      pdf.addImage(imgData, "JPEG", 10, 10);
      pdf.save(`${new Date().toISOString()}.pdf`);
    });
  };


  const formatCurrency = (amount) => {
    return (new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount))
  }


  const calcLineItemsTotal = (event) => {
    return lineItems.reduce((prev, cur) => (prev + (cur.quantity * cur.price)), 0)
  }

  const calcTaxTotal = () => {
    return  calcLineItemsTotal () * (taxRate / 100)
  }

  const calcGrandTotal = () => {
    return calcLineItemsTotal() + calcTaxTotal()
  }
  function getClients(){
    axios.get(`http://localhost:8081/clients`)
      .then(res => {
        console.log(res);
        setClients(res.data)
      })
  }

  function componentDidMount(){
    fetchOptions()
  }

  function fetchOptions(){
    fetch('http://localhost:8081/clients')
      .then((res) => {
        return res.json();
      }).then((json) => {
      var values = json;
      setClients({options: values.values})
      console.log(values);
    });
  }
  const dropdownRef = useRef(null);
  const [isActive, setIsActive] = useDetectOutsideClick(dropdownRef, false);
  const onClick1 = () => setIsActive(!isActive);

  const [active, setActive] = useState(0);
  const handleClick = e => {
    const index = parseInt(e.target.id, 0);
    if (index !== active) {
      setActive(index);
    }
  };

  const [selected, setSelected] = useState(Clients[0]);
  function onChangeClient(event) {
    //const value = parseInt(event.target.value);
    setSelected(event.target.value)
    //setSelected(Clients.find((Clients) => Clients.id === value));
    console.log(value);
  }
  return (


    <div className={styles.invoice} id="pdf">
      <Tabs>
        <Tab onClick={handleClick} active={active === 0} id={0}>
          Facture TVA
        </Tab>

        <Tab onClick={handleClick} active={active === 1} id={1}>
          Facture sans TVA
        </Tab>
      </Tabs>
      <div>
        <Content active={active === 0}>
          <h1>Facture TVA</h1>
          <div className={styles.brand}>
          <Logo logoFile={file} fileHandler={fileHandler} fileName={fileName} />
            <div className={styles.addresses}>
              <div className={styles.from}>
                <strong>Client : </strong><br />
                <select onChange={onChangeClient} value={selected}>
                  {company.map((item, index) =>
                    <option
                      key={index}
                      value= {item.name}
                    > {item.name} </option>
                  )}
                </select>
                <br />
                <strong>Digital Rogue wave </strong><br />
                Ariana <br />
                Ariana, ON, Tunis &nbsp;A1B2C3<br />

              </div>
              <div>
                <div className={`${styles.valueTable} ${styles.to}`}>
                  <div className={styles.row}>
                    <div className={styles.label}>Customer #</div>
                    <div className={styles.value}>123456</div>
                  </div>
                  <div className={styles.row}>
                    <div className={styles.label}>Invoice #</div>
                    <div className={styles.value}> <input name="Invoicenumber" type="text"  value={invoiceno} onChange={e => setinvoiceno(e.target.value)}  /></div>
                  </div>
                  <div className={styles.row}>
                    <div className={styles.label}>Issue Date</div>
                    <div className={`${styles.value} ${styles.date}`}><input name="Invoicdate" type="date"  value={invoicedate} onChange={e => setinvoicdate(e.target.value)}  /></div>
                  </div>
                  <div className={styles.row}>
                    <div className={styles.label}>Due Date</div>
                    <div className={`${styles.value} ${styles.date}`}><input name="Invoicdate" type="date"  value={invoiceduedate} onChange={e => setinvoicduedate(e.target.value)}  /></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <h2 className={styles.invoiceTitle}>Invoice</h2>

          <LineItems
            items={lineItems}
            currencyFormatter={formatCurrency}
            addHandler={handleAddLineItem}
            changeHandler={handleLineItemChange}
            focusHandler={handleFocusSelect}
            deleteHandler={handleRemoveLineItem}
            reorderHandler={handleReorderLineItems}
            toggleShowQuantityHandler={toggleShowQuantity}
            showQuantity={showQuantity}
          />

          <div className={styles.totalContainer}>
            <form>
              <div className={styles.valueTable}>
                <div className={styles.row}>
                  <div className={styles.label}>Tax Rate (%)</div>
                  <div className={styles.value}>
                    <input name="taxRate" type="number" step="0.01" value={taxRate} onChange={handleTaxChange} onFocus={handleFocusSelect} />
                  </div>
                </div>
              </div>
            </form>
            <form>
              <div className={styles.valueTable}>
                <div className={styles.row}>
                  <div className={styles.label}>Subtotal</div>
                  <div className={`${styles.value} ${styles.currency}`}>{formatCurrency(calcLineItemsTotal())}</div>
                </div>
                <div className={styles.row}>
                  <div className={styles.label}>Tax ({taxRate}%)</div>
                  <div className={`${styles.value} ${styles.currency}`}>{formatCurrency(calcTaxTotal())}</div>
                </div>
                <div className={styles.row}>
                  <div className={styles.label}>Total Due</div>
                  <div className={`${styles.value} ${styles.currency}`}>{formatCurrency(calcGrandTotal())}</div>
                </div>
              </div>
            </form>
          </div>
          {/* eslint-disable-next-line react/jsx-no-undef */}


          <div className={styles.pay}>
            <div>
              {errors && Object.entries(errors).length  > 0 &&
              Object.entries(errors.error.response._errors).save(([key, value]) => {
                return <div key={key}>{key}: {value}</div>
              })
              }
            </div>
            <button className={styles.payNow} onClick={submitFormAdd}>Save Invoice</button>
            {/*<form className="contact-form" onSubmit={sendEmail}>
              <input type="hidden" name="contact_number" />
              <label>Name</label>
              <input type="text" name="name" />
              <label>Email</label>
              <input type="email" name="user_email" />
              <label>Message</label>
              <textarea name="message" />
              <input type="submit" value="Send" />
            </form>*/}
          </div>
          <div className="container">
            <div className="menu-container">
              <button onClick={onClick1} className="menu-trigger">
                <span>Options</span>
                <img
                  src=""
                  alt=""
                />
              </button>
              <nav
                ref={dropdownRef}
                className={`menu ${isActive ? "active" : "inactive"}`}
              >
                <ul>
                  <li>
                    <a  onClick={sendEmail}>Send by email</a>
                  </li>
                  <li>
                    <a href="#">Save</a>
                  </li>
                  <li>
                    <a onClick={submitDraftAdd} >Save As Draft</a>
                  </li>
                </ul>
              </nav>
            </div>
          </div>

          <div className={styles.area}>
            <Textarea inputRef={tag => (this.textarea = tag)} />

          </div>

          <div className={styles.footer}>
            <div className={styles.comments}>
            </div>
            <div className={styles.closing}>
            </div>
          </div>
        </Content>
        <Content active={active === 1}>
          <h1>Facture Sans TVA</h1>

          <div className={styles.brand}>
            <Logo logoFile={file} fileHandler={fileHandler} fileName={fileName} />
            <div className={styles.addresses}>
              <div className={styles.from}>
                <strong>Client : </strong><br />
                <select>
                  {Clients.map((caldata, index) =>
                    <option
                      key={index}
                      value= {caldata.id}
                    > {caldata.name} </option>
                  )}
                </select>
                <br />
                <strong>Digital Rogue wave </strong><br />
                Ariana <br />
                Ariana, ON, Tunis &nbsp;A1B2C3<br />

              </div>
              <div>
                <div className={`${styles.valueTable} ${styles.to}`}>
                  <div className={styles.row}>
                    <div className={styles.label}>Customer #</div>
                    <div className={styles.value}>123456</div>
                  </div>
                  <div className={styles.row}>
                    <div className={styles.label}>Invoice #</div>
                    <div className={styles.value}>123456</div>
                  </div>
                  <div className={styles.row}>
                    <div className={styles.label}>Date</div>
                    <div className={`${styles.value} ${styles.date}`}>{new Date().toLocaleString() + ''}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <h2 className={styles.invoiceTitle}>Invoice</h2>

          <LineItems
            items={lineItems}
            currencyFormatter={formatCurrency}
            addHandler={handleAddLineItem}
            changeHandler={handleLineItemChange}
            focusHandler={handleFocusSelect}
            deleteHandler={handleRemoveLineItem}
            reorderHandler={handleReorderLineItems}
            toggleShowQuantityHandler={toggleShowQuantity}
            showQuantity={showQuantity}
          />

          <div className={styles.totalContainer}>
            <form>

            </form>
            <form>
              <div className={styles.valueTable}>
                <div className={styles.row}>
                  <div className={styles.label}>Subtotal</div>
                  <div className={`${styles.value} ${styles.currency}`}>{formatCurrency(calcLineItemsTotal())}</div>
                </div>
                <div className={styles.row}>
                  <div className={styles.label}>Total Due</div>
                  <div className={`${styles.value} ${styles.currency}`}>{formatCurrency(calcGrandTotal())}</div>
                </div>
              </div>
            </form>
          </div>
          {/* eslint-disable-next-line react/jsx-no-undef */}


          <div className={styles.pay}>
            <button className={styles.payNow} onClick={printDocument}>Download as pdf</button>
          </div>
          <div className="container">
            <div className="menu-container">
              <button onClick={onClick1} className="menu-trigger">
                <span>Options</span>
                <img
                  src=""
                  alt=""
                />
              </button>
              <nav
                ref={dropdownRef}
                className={`menu ${isActive ? "active" : "inactive"}`}
              >
                <ul>
                  <li>
                    <a href="#">Send by email</a>
                  </li>
                  <li>
                    <a href="#">Save</a>
                  </li>
                  <li>
                    <a href="#">Save As Draft</a>
                  </li>
                </ul>
              </nav>
            </div>
          </div>

          <div className={styles.area}>
            <Textarea inputRef={tag => (this.textarea = tag)} />

          </div>

          <div className={styles.footer}>
            <div className={styles.comments}>
            </div>
            <div className={styles.closing}>
            </div>
          </div>
        </Content>
      </div>


    </div>

  )

}

