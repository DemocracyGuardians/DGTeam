
import 'babel-polyfill'
import React from 'react'
import { render } from 'react-dom'
import thunkMiddleware from 'redux-thunk'
import { createLogger } from 'redux-logger'
import { createStore, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import './index.css';
import App from './App';
import sessionReducer from './reducers/sessionReducer'
//import logger from './middleware/logger'
//import callApi from './middleware/callApi'

const loggerMiddleware = createLogger()

const store = createStore(
  sessionReducer,
  applyMiddleware(
    thunkMiddleware, // lets us dispatch() functions
    loggerMiddleware // neat middleware that logs actions
  )
)

render(
  <Provider store={store}>
    	<App store={store} />
  </Provider>,
  document.getElementById('root')
);
