import React, {Component, useEffect, useState} from 'react'
import PropTypes from 'prop-types'
import {MdAddCircle as AddIcon, MdCancel as DeleteIcon} from 'react-icons/md'
import styles from '../LineItem.module.scss'



export function LineItem(props)  {


  const [isOpened, setIsOpened] = useState(false);

  function toggle() {
    setIsOpened(wasOpened => !wasOpened);
  }
  const [show, toggleShow] = useState(true);
  const { index, name, description, quantity, price, showQuantity } = props

  const[form, setValues] = useState({
  })

  const onChange = e => {
    setValues({
      ...form,
      [e.target.name]: e.target.value
    })
  }
  const [invoice, setInvoice] = useState(props.invoice)


  const submitFormAdd = e => {
    e.preventDefault()
    fetch(`${process.env.REACT_APP_API_URL}/invoice`, {
      method: 'put',
      headers: {
        'Content-Type': 'application/json',
        'x-business-name' : 'billings',
        "Accept":"application/json"
      },
      body: JSON.stringify({
        invoiceno: "8",
        description: "facture",
        taxrate: 10,
        issuedate: "2021-07-14T23:00:00.000Z",
        duedate: "2021-07-08T23:00:00.000Z",
        note: "facture",
        taxamount: 10,
        subtotal: 100,
        total: 100,
        itemId: 1,
        updatedAt: "2021-07-05T23:00:00.000Z",
        updatedBy: 14,
        createdAt: "2021-07-14T23:00:00.000Z",
        createdBy: 25,
        items:[
          {
            description: description,
            item: parseInt(name),
            quantity: quantity,
            price: price
          }]
        })
    })
      .then(response => response.json())
      .then(item => {
        if(Array.isArray(item)) {
          props.addItemToState(item[0])
          props.toggle()
        } else {
          console.log()
        }
      })
      .catch(err => console.log(err))
  }


  return (

    <div className={styles.lineItem}>

      <div>{index + 1}</div>
      <div><input name="name" type="text" value={name} onChange={props.changeHandler(index)} /></div>
      <div><input name="description" type="text" value={description} onChange={props.changeHandler(index)} /></div>
      {showQuantity && <div className={styles.quantityWrapper}>
        <button type="button"
                className={show ? styles.hideQuantity : styles.showQuantity}
                onClick={() => toggleShow(!show)}
        >
          {show ? <DeleteIcon size="0.001em" /> : <AddIcon size="0.001em" />}
        </button>
        {show && <input name="quantity" type="number" step="1" value={quantity} onChange={props.changeHandler(index)} onFocus={props.focusHandler} onClick={toggle} />}
      </div> }

      <div className={styles.currency}><input name="price" type="number" step="0.01" min="0.00" max="9999999.99" value={price} onChange={props.changeHandler(index)} onFocus={props.focusHandler} /></div>
      <div className={styles.currency}>{props.currencyFormatter( quantity * price )}</div>
      <button type="button"
              className={styles.deleteLine}
              onClick={props.deleteHandler(index)}
      ><DeleteIcon size="1.25em" /></button>


    </div>
  )

}



LineItem.propTypes = {
  index: PropTypes.number.isRequired,
  name: PropTypes.string,
  description: PropTypes.string,
  quantity: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  price: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  currencyFormatter: PropTypes.func.isRequired,
  addHandler: PropTypes.func,
  changeHandler: PropTypes.func.isRequired,
  focusHandler: PropTypes.func.isRequired,
  deleteHandler: PropTypes.func.isRequired,
  reorderHandler: PropTypes.func,
  showQuantity: PropTypes.bool


}


