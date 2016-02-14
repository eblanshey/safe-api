import { createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import reducer from './reducers.js'

// Prepare store
const createStoreWithMiddleware = applyMiddleware(
  thunk
)(createStore)

export default createStoreWithMiddleware(reducer)

