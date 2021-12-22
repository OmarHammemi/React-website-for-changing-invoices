import React, { useState, useEffect } from 'react'
import { Container, Row, Col } from 'reactstrap'
import { CSVLink } from "react-csv"
import DataTable from "./DataTable";
import ModalForm from "./Modal";
import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';


function App(props) {

  const [items, setItems] = useState([])

  const getItems= () => {
    fetch(`${process.env.REACT_APP_API_URL}/company`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'x-business-name' : 'billings',
        "Accept":"application/json",
        "Bearer": localStorage.getItem('user').token
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

  return (
    <Container className="App">
      <Row>
        <Col>
          <h1 style={{margin: "20px 0"}}>My companies</h1>
        </Col>
      </Row>
      <Row>
        <Col>
          <DataTable items={items} updateState={updateState} deleteItemFromState={deleteItemFromState} />
        </Col>
      </Row>
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
          <ModalForm buttonLabel="Add Item" addItemToState={addItemToState}/>
        </Col>
      </Row>
    </Container>
  )
}

export default App
