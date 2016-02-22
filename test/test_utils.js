import { createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import reducer from '../src/reducers'
import {fromJS} from 'immutable'

// Add a restore method to global object to easily restore all needed sinon modifications
export function restore() {
  const args = Array.prototype.slice.call(arguments);

  args.forEach(func => func.restore());
}

export function createTestStore(initialValue) {
  // Prepare store
  const createStoreWithMiddleware = applyMiddleware(
    thunk
  )(createStore)

  return createStoreWithMiddleware(reducer, fromJS(initialValue))
}