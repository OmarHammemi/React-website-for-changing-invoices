import * as actionTypes from "../Constants/invoice.constants";


const initialStateInvoice = {
  taxRate: 0.00,
  lineItems: [
    {
      id: 'initial',      // react-beautiful-dnd unique key
      name: '',
      description: '',
      quantity: 0,
      price: 0.00,
    },
  ]
}

  const reducerInvoice  = (state = initialStateInvoice, action) => {
    switch (action.type) {
      case actionTypes.ADD_TO_INVOICE:
        return {};
      case actionTypes.REMOVE_FROM_INVOICE:
        return {};
      default:
        return state;

    }
}

export default reducerInvoice;
