import * as actionTypes from "../Constants/invoice.constants";
export const handleAddLineItem = (itemID) => {
  return {
    type: actionTypes.ADD_TO_INVOICE,
    payload: {
      id: itemID,
    },
  };
};
export const handleRemoveLineItem = (itemID) => {
  return {
    type: actionTypes.REMOVE_FROM_INVOICE,
    payload: {
      id: itemID,
    },
  };
};


