import React, { useState, useEffect } from 'react'
import { Container, Row, Col } from 'reactstrap'
import { CSVLink } from "react-csv"
import DataTable from "./DataTable";
import ModalForm from "./Modal";
import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import {useHistory} from "react-router";
import {MdAddCircle as AddIcon} from "react-icons/md";
import styles from "../Invoice/LineItems.module.scss";
import {Content, Tab, Tabs} from "../Invoice/tab";


function App(props) {
  const history = useHistory();

  const routeChange = () =>{
    let path = `newPath`;
    history.push('/facture');
  }
  const [paiditems, setpaidItems] = useState([])
    const getPaidItems= () => {
      fetch(`${process.env.REACT_APP_API_URL}/invoice/status/0`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'x-business-name' : 'billings',
          "Accept":"application/json"
        },

      })
        .then(response => response.json())
        .then(paiditems => setpaidItems(paiditems))
        .catch(err => console.log(err))
    }

  useEffect(() => {
    getPaidItems()
  }, []);


  const [archivitems, setarchivItems] = useState([])
  const getarchivItems= () => {
    fetch(`${process.env.REACT_APP_API_URL}/invoice/Archive`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'x-business-name' : 'billings',
        "Accept":"application/json"
      },

    })
      .then(response => response.json())
      .then(archivitems => setarchivItems(archivitems))
      .catch(err => console.log(err))
  }

  useEffect(() => {
    getarchivItems()
  }, []);

  const [draftitems, setdraftItems] = useState([])
  const getdraftItems= () => {
    fetch(`${process.env.REACT_APP_API_URL}/invoice/Draft`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'x-business-name' : 'billings',
        "Accept":"application/json"
      },

    })
      .then(response => response.json())
      .then(draftitems => setdraftItems(draftitems))
      .catch(err => console.log(err))
  }

  useEffect(() => {
    getdraftItems()
  }, []);

  const [items, setItems] = useState([])

  const getItems= () => {
    fetch(`${process.env.REACT_APP_API_URL}/invoice`, {
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

  const addItemToState = (item) => {
    setItems([...items, item])
  }

  const updateState = (item) => {
    const itemIndex = items.findIndex(data => data.id === item.id)
    const newArray = [...items.slice(0, itemIndex), item, ...items.slice(itemIndex + 1)]
    setItems(newArray)
  }

  const deleteItemFromState = (id) => {
    const updatedItems = items.filter(item => item.id !== id)
    setItems(updatedItems)
  }

  useEffect(() => {
    getItems()
  }, []);
  const [active, setActive] = useState(0);
  const handleClick = e => {
    const index = parseInt(e.target.id, 0);
    if (index !== active) {
      setActive(index);
    }
  };


  return (


    <Container className="App">
      <Tabs>
        <Tab onClick={handleClick} active={active === 0} id={0}>
          My Invoices
        </Tab>

        <Tab  style={{ color : '#DC143C'}} onClick={handleClick} active={active === 1} id={1}>
          Unpaid Invoices
        </Tab>
        <Tab style={{color : '#483D8B'}} onClick={handleClick} active={active === 2} id={2}>
          Archived Invoices
        </Tab>
        <Tab style={{color : '#FFD700'}} onClick={handleClick} active={active === 3} id={3}>
          Saved As Draft
        </Tab>
      </Tabs>
      <Content active={active === 0}>
      <Row>
        <Col>
          <h1 style={{margin: "20px 0"}}>My Invoices</h1>
        </Col>
      </Row>
      <Row>
        <Col>
          <DataTable items={items} updateState={updateState} deleteItemFromState={deleteItemFromState} />

        </Col>
      </Row>
      </Content>
      <Content active={active === 1}>
      <Row>
        <Col>
          <h1 style={{margin: "20px 0", color : '#DC143C'}} >Unpaid Invoices</h1>
        </Col>
      </Row>
      <Row style={{borderwidth: "thin"}}>
        <Col>
          <DataTable items={paiditems} updateState={updateState} deleteItemFromState={deleteItemFromState} />

        </Col>
      </Row>
      </Content>
        <Content active={active === 2}>
      <Row>
        <Col>
          <h1 style={{margin: "20px 0", color : '#483D8B'}} >Archived Invoices</h1>
        </Col>
      </Row>
      <Row>
        <Col>
          <DataTable items={archivitems} updateState={updateState} deleteItemFromState={deleteItemFromState} />

        </Col>
      </Row>
        </Content>
          <Content active={active === 3}>
      <Row>
        <Col>
          <h1 style={{margin: "20px 0", color : '#FFD700'}} >Saved As Draft</h1>
        </Col>
      </Row>
      <Row>
        <Col>
          <DataTable items={draftitems} updateState={updateState} deleteItemFromState={deleteItemFromState} />

        </Col>
      </Row>
          </Content>
      <Row>
        <Col>
          <CSVLink
            filename={"db.csv"}
            color="primary"
            style={{float: "left", marginRight: "10px"}}
            className="btn btn-primary"
            data={items}>
            Download CSV
          </CSVLink>
          <ModalForm buttonLabel="Add Item"   onClick={routeChange}/>
          <div className={styles.lineItems}>
          <div className={styles.addItem}>
            <button type="button" onClick={routeChange}><AddIcon size="1.25em" className={styles.addIcon} /> New Invoice</button>
          </div>
          </div>
        </Col>
      </Row>
    </Container>
  )
}

export default App
