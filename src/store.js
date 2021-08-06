import { applyMiddleware, createStore } from "redux";
import roofReducer from "./reducers";
import ReduxThunk from 'redux-thunk';

const store = createStore(
  roofReducer,
  applyMiddleware(ReduxThunk),
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

export default store;
