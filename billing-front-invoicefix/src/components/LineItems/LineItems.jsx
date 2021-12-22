import React, {Component, useEffect, useState} from 'react'
import PropTypes from 'prop-types'
import { LineItem } from '../Invoice/lineItem';
import {MdAddCircle as AddIcon, MdCancel as DeleteIcon} from 'react-icons/md'
import styles from '../Invoice/LineItems.module.scss'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'


export default function LineItems (props) {




  const handleDragEnd = (result) => {

    if (!result.destination) return

    // helper function to reorder result (src: react-beautiful-dnd docs)
    const reorder = (list, startIndex, endIndex) => {
      const result = Array.from(list)
      const [removed] = result.splice(startIndex, 1)
      result.splice(endIndex, 0, removed)
      return result
    }

    // perform reorder
    const lineItems = reorder(
      props.items,
      result.source.index,
      result.destination.index
    )

    // call parent handler with new state representation
    props.reorderHandler(lineItems)

  }

  const {items, addHandler, reorderHandler, showQuantity, toggleShowQuantityHandler, ...functions} = props

  const [filtering, setFiltering] = React.useState(false);

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
        items
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
    <div>
      <form>
        <div>
          <button type="button"
                  className={ showQuantity ? styles.deleteBtn : styles.addBtn }
                  onClick={toggleShowQuantityHandler}
          >
            {showQuantity ? <span><DeleteIcon size="1.25em" style={{ marginRight: '5px' }} /> Remove Quantity</span> : (<span><AddIcon size="1.25em" style={{ marginRight: '5px' }} /> Add Quantity</span>)}
          </button>
        </div>
        <div className={styles.lineItems}>
          <div className={`${styles.gridTable}`}>

            <div className={`${styles.row} ${styles.header}`}>
              <div>#</div>
              <div>Item</div>
              <div>Description</div>
              {showQuantity && <div>Qty</div>}
              <div>Price</div>
              <div>Total</div>
            </div>

            <DragDropContext onDragEnd={handleDragEnd}>
              <Droppable droppableId="droppable">
                {(provided, snapshot) => (
                  <div ref={provided.innerRef} className={snapshot.isDraggingOver ? styles.listDraggingOver : ''}>
                    {items.map((item, i) => (
                      <Draggable key={item.id} draggableId={item.id} index={i}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            style={provided.draggableProps.style}
                            className={snapshot.isDragging ? styles.listItemDragging : ''}
                          >
                            <LineItem
                              style={{color: 'red'}}
                              key={i + item.id} index={i} name={item.name}
                              description={item.description} quantity={item.quantity} price={item.price}
                              showQuantity={showQuantity}
                              {...functions}
                            />
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>

          </div>

          <div className={styles.addItem}>
            <button type="button" onClick={addHandler}><AddIcon size="1.25em" className={styles.addIcon} /> Add Item</button>
          </div>

        </div>
      </form>
    </div>
  )

}



LineItems.propTypes = {
  items: PropTypes.array.isRequired,
  currencyFormatter: PropTypes.func.isRequired,
  addHandler: PropTypes.func.isRequired,
  changeHandler: PropTypes.func.isRequired,
  focusHandler: PropTypes.func.isRequired,
  deleteHandler: PropTypes.func.isRequired,
  reorderHandler: PropTypes.func.isRequired,
  toggleShowQuantityHandler: PropTypes.func,
  showQuantity: PropTypes.bool
}


