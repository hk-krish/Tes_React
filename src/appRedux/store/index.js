import createSagaMiddleware from "redux-saga";
import { applyMiddleware, createStore } from "redux";
import { routerMiddleware } from "connected-react-router";
import thunk from "redux-thunk";
import rootSaga from "../sagas/index";
import createRootReducer from "../reducers";
import { composeWithDevTools } from "redux-devtools-extension";

const createBrowserHistory = require("history").createBrowserHistory;

export const history = createBrowserHistory();

const routeMiddleware = routerMiddleware(history);
// const sagaMiddleware = createSagaMiddleware();

const middlewares = [thunk, routeMiddleware];

export default function configureStore(preloadedState) {
  const store = createStore(
    createRootReducer(history), // root reducer with router state
    preloadedState,
    composeWithDevTools(
      applyMiddleware(
        routerMiddleware(history), // for dispatching history actions
        ...middlewares,
      ),
    ),
  );

  // sagaMiddleware.run(rootSaga);
  return store;
}
