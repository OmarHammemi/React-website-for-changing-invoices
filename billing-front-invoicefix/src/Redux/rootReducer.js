import { combineReducers } from "redux";

import reducerInvoice from "../Reducers/reducerInvoice";
import reducerReminder from "../Reducers/reducerReminder";

const rootReducer = combineReducers({
  reducerInvoice,
  reducerReminder,
});

export default rootReducer;
