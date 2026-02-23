import { createStore, applyMiddleware } from "redux";
import { createBrowserHistory } from "history";
import { routerMiddleware } from "connected-react-router";
import thunkMiddleware from "redux-thunk";

import combineReducers from "./reducers";

const history = createBrowserHistory();

const store = createStore(
  combineReducers(history),
  applyMiddleware(routerMiddleware(history), thunkMiddleware)
);

export default store;
