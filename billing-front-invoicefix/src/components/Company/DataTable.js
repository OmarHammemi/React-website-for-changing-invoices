import React from 'react'
import { Table, Button } from 'reactstrap';
import ModalForm from "./Modal";


function DataTable(props){
  const deleteItem = id => {
    let confirmDelete = window.confirm('Delete item forever?')
    if(confirmDelete){
      fetch('http://localhost:3000/crud', {
        method: 'delete',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          id
        })
      })
        .then(response => response.json())
        .then(item => {
          props.deleteItemFromState(id)
        })
        .catch(err => console.log(err))
    }
  }

  const items = props.items.map(item => {
    return (
      <tr key={item.id}>
        <th scope="row">{item.id}</th>
        <td>{item.name}</td>
        <td>{item.siren}</td>
        <td>{item.industry}</td>
        <td>{item.description}</td>
        <td>{item.logoUrl}</td>
        <td>{item.email}</td>
        <td>
          <div style={{width:"110px"}}>
            <ModalForm buttonLabel="Edit" item={item} updateState={props.updateState}/>
            {' '}
            <Button color="danger" onClick={() => deleteItem(item.id)}>Del</Button>
          </div>
        </td>
      </tr>
    )
  })

  return (
    <Table responsive hover>
      <thead>
      <tr>
        <th>ID</th>
        <th>Name</th>
        <th>Siren</th>
        <th>Industry</th>
        <th>Description</th>
        <th>logourl</th>
        <th>Email</th>
        <th>Actions</th>
      </tr>
      </thead>
      <tbody>
      {items}
      </tbody>
    </Table>
  )
}

export default DataTable
