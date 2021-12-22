import React from 'react'
import {Table, Button, Col} from 'reactstrap';
import ModalForm from "./Modal";
import styles from "../Invoice/LineItems.module.scss";
import styles1 from "../Invoice/Invoice.module.scss"
import {MdAddCircle as AddIcon} from "react-icons/md";
import {useHistory} from "react-router";
import {Link} from "react-router-dom";
import dateFormat from "dateformat";



function DataTable(props){

  const history = useHistory();

  const routeChange = () =>{
    let path = `newPath`;
    history.push('/Invoiceview');
  }

  const deleteItem = id => {
    let confirmDelete = window.confirm('Delete item forever?')
    if(confirmDelete){
      fetch(`${process.env.REACT_APP_API_URL}/invoice/`, {
        method: 'delete',
        headers: {
          'Content-Type': 'application/json',
          'x-business-name' : 'billings',
          "Accept":"application/json"
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
        <td>{item.invoiceno}</td>
        <td>{item.description}</td>
        <td>{dateFormat(item.issuedate, "mmmm dS, yyyy")}</td>
        <td>{dateFormat(item.duedate, "mmmm dS, yyyy")}</td>
        <td>{item.note}</td>
        <td>{item.taxamount}</td>
        <td>{item.subtotal}</td>
        <td>{item.items.map(item => <div>{item.description}</div>)}</td>
        <td>{item.total}</td>
        <td>
          <div style={{width:"110px"}}>
            <ModalForm buttonLabel="Edit" item={item} updateState={props.updateState}/>
            {' '}
            <Button color="danger" onClick={() => deleteItem(item.id)}>Del</Button>

            <Link
              to={{
                pathname: `/Invoiceview/${item.id}`
              }}
            >
              <Button color="success" >View Invoice</Button>
            </Link>;
          </div>
        </td>
      </tr>
    )
  })

  return (
    <div className={styles1.myinvoice} id="pdf">
    <Table responsive hover>
      <thead>
      <tr>
        <th>ID</th>
        <th>invoiceno</th>
        <th>description</th>
        <th>issuedate</th>
        <th>duedate</th>
        <th>note</th>
        <th>taxamount</th>
        <th>subtotal</th>
        <th>items</th>
        <th>total</th>

      </tr>
      </thead>
      <tbody>
      {items}
      </tbody>
    </Table>
    </div>
  )
}

export default DataTable
