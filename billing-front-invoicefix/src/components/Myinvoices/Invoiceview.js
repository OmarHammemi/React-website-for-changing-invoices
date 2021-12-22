import React, {useEffect, useRef, useState} from 'react'
import { useMemo } from 'react'
import Select from 'react-select'
import styles from '../Invoice/Invoice.module.scss'
import styles1 from '../Invoice/LineItems.module.scss'
import { v4 as uuidv4 } from 'uuid';
import { jsPDF } from "jspdf";
import html2canvas from 'html2canvas';
import Logo from '../Invoice/Logo';
//import {AppBar, FormControl, Paper, Tab, Tabs} from "@material-ui/core";
import { Tabs, Tab, Content } from "../Invoice/tab";
import axios from 'axios'
import 'react-dropdown/style.css';
import Clients from "../Data/Clients.json";
import Textarea from "react-textarea-autosize";
import "../Invoice/style.css";
import {useDetectOutsideClick} from "../Invoice/useDetectOutsideClick";
import DataTable from "./DataTable";
import LineItems from "../LineItems/LineItems";
import {Button, Table} from "reactstrap";
import ModalForm from "./Modal";
import {Link} from "react-router-dom";
import dateFormat from 'dateformat';
import {MdAddCircle as AddIcon} from "react-icons/md";







export default function Invoiceview ()  {
  let urlElements = window.location.href.split('/')
  console.log(urlElements[4])

  const [items, setItems] = useState([])

  const getItems= () => {
    fetch(`${process.env.REACT_APP_API_URL}/invoice/${urlElements[4]}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'x-business-name' : 'billings',
        "Accept":"application/json"
      },

    })
      .then(response => response.json())
      .then(items => setItems(items))
      .catch(err => console.log(err))
  }

  useEffect(() => {
    getItems()
  }, []);

  const markpaid =  () => {
    let confirmDelete = window.confirm('mark as paid?')
    if(confirmDelete){
      fetch(`${process.env.REACT_APP_API_URL}/invoice/paid/${urlElements[4]}`, {
        method: 'delete',
        headers: {
          'Content-Type': 'application/json',
          'x-business-name' : 'billings',
          "Accept":"application/json"
        },
        body: JSON.stringify({
        })
      })
        .then(response => response.json())
        .then(item => {

        })
      window.confirm('Marked as paid')
        .catch(err => console.log(err))

    }
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


  console.log(items)
  const locale = 'en-US'
  const currency = 'USD'

  const [taxRate, setTaxRate] = useState(0.00);
  //const [value, setValue] = useState(0);
  //const [activeTab, setActiveTab] = useState('1');
  const [ fileName, setFileName ] = useState('');
  const [ showQuantity, setShowQuantity] = useState(true);

  const toggleShowQuantity = () => {
    setShowQuantity(!showQuantity);
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
      id: 'initial',
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
      [{ id: uuidv4(), name: '', description: '', quantity: 1, price: 0.00 }]
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
    html2canvas(input, {scrollY: -window.scrollY,  dpi: 144,scale: 2,
      ignoreElements: function (node) {
        return node.nodeName === 'IFRAME';
      }
    })
      .then((canvas) => {
        let imgWidth = 195;
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

  return (


    <div className={styles.invoice} id="pdf">

          <h1>Facture TVA</h1>
          <div className={styles.brand}>
            <Logo logoFile={file} fileHandler={fileHandler} fileName={fileName} />
            <div className={styles.addresses}>
              <div className={styles.from}>
                <strong>Client :</strong><br />
                <select>
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
                    <div className={styles.label}>
                     Status</div>

                    <div className={styles.value}>{items.map( item => <div>{item.status.toString()}</div>)}</div>
                  </div>
                  <div className={styles.row}>
                    <div className={styles.label}>Invoice #</div>
                    <div className={styles.value}>{items.map( item => <div>{item.invoiceno}</div>)}</div>
                  </div>
                  <div className={styles.row}>
                    <div className={styles.label}>Issue Date</div>
                    <div className={`${styles.value} ${styles.date}`}>{items.map( item => <div>{dateFormat(item.issuedate, "mmmm dS, yyyy")}</div>)}</div>
                  </div>
                  <div className={styles.row}>
                    <div className={styles.label}>Issue Date</div>
                    <div className={`${styles.value} ${styles.date}`}>{items.map( item => <div>{dateFormat(item.duedate, "mmmm dS, yyyy")}</div>)}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <h2 className={styles.invoiceTitle}>Invoice</h2>
      <div>

        <div>

          <Table id='students'>
            <thead>
            <tr>
              <th>#Number</th>
              <th>Item</th>
              <th>Description</th>
              <th>Quantity</th>
              <th>Price</th>
            </tr>
            </thead>
            <tbody>
            {items.length > 0 && items[0].items && items[0].items.map(item => {
              return (
                <tr>
                  <th scope="row">{item.id}</th>
                  <td>{item.description}</td>
                  <td>{item.name}</td>
                  <td>{item.quantity}</td>
                  <td>{item.price}</td>
                </tr>
              );
            })}
            </tbody>
          </Table>
        </div>

        </div>
      <div className={styles.totalContainer}>
            <form>
              <div className={styles.valueTable}>
                <div className={styles.row}>
                  <div className={styles.label}>Tax Rate (%)</div>
                  <div className={styles.value}>
                    <input name="taxRate" type="number" step="0.01" value={items.map( item => <div>{item.taxamount}</div>)}  />
                  </div>
                </div>
              </div>
            </form>
            <form>
              <div className={styles.valueTable}>
                <div className={styles.row}>
                  <div className={styles.label}>Subtotal</div>
                  <div className={`${styles.value} ${styles.currency}`}>{items.map( item => <div>{formatCurrency(item.subtotal)}</div>)}</div>
                </div>
                <div className={styles.row}>
                  <div className={styles.label}>Tax ({items.map( item => <div>{item.taxamount}</div>)}%)</div>
                  <div className={`${styles.value} ${styles.currency}`}>{items.map( item => <div>{formatCurrency(item.taxamount)}</div>)}</div>
                </div>
                <div className={styles.row}>
                  <div className={styles.label}>Total Due</div>
                  <div className={`${styles.value} ${styles.currency}`}>{items.map( item => <div>{formatCurrency(item.total)}</div>)}</div>
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


          <div className={styles.footer}>
            <div className={styles.comments}>
              <div className={styles1.lineItems}>
              <div className={styles1.addItem}>
                <button type="button" on onClick={markpaid} ><AddIcon size="1.25em" className={styles1.addIcon} />Mark invoice as paid</button>
              </div>
              </div>
            </div>
            <div className={styles.closing}>
            </div>
          </div>





    </div>

  )

}

