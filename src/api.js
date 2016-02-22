import store from './store'
import * as actions from './actions';
import { toJSifNeeded } from './utils'

// NETWORK INTERACTION
export function loadEntity(...args) {
  return store.dispatch(actions.loadEntity(...args))
}

export function getEntity(...args) {
  return store.dispatch(actions.getEntity(...args))
}

export function putEntity(...args) {
  return store.dispatch(actions.putEntity(...args))
}

export function deleteEntity(...args) {
  return store.dispatch(actions.deleteEntity(...args))
}

export function loadCollection(...args) {
  return store.dispatch(actions.loadCollection(...args))
}

export function getCollection(...args) {
  return store.dispatch(actions.getCollection(...args))
}

export function putCollectionItem(...args) {
  return store.dispatch(actions.putCollectionItem(...args))
}

export function deleteCollectionItem(...args) {
  return store.dispatch(actions.deleteCollectionItem(...args))
}

export function deleteEntireCollection(...args) {
  return store.dispatch(actions.deleteEntireCollection(...args))
}

export function login(...args) {
  return store.dispatch(actions.submitEmailLogin(...args))
}

export function signup(...args) {
  return store.dispatch(actions.signup(...args))
}

export function getAuthData() {
  return toJSifNeeded(store.getState().getIn(['auth', 'authData']))
}

export function getStore() {
  return store
}