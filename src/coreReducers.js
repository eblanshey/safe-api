import {Map, fromJS} from 'immutable'

// Login
export function loginRequest(authState) {
  return authState
    .set('isLoggingIn', true)
    .set('authData', null)
    .set('userid', null)
    .set('error', null)
}
export function loginSuccess(authState, newAuthData) {
  const newState = authState
    .set('isLoggingIn', false)
    .set('authData', newAuthData ? fromJS(newAuthData) : null)
    .set('userid', newAuthData ? newAuthData.uid : null)
    .set('error', null)

  return newState
}
export function loginFailure(authState, error) {
  return authState
    .set('authData', null)
    .set('userid', null)
    .set('isLoggingIn', false)
    .set('error', error)
}

// Signup handlers
export function signupRequest(authState) {
  return authState.set('isSigningUp', true).set('error', null)
}
export function signupSuccess(authState) {
  return authState
    .set('isSigningUp', false)
    .set('didCreateLogin', true)
    .set('error', null)
}
export function signupFailure(authState, error) {
  return authState
    .set('isSigningUp', false)
    .set('didCreateLogin', false)
    .set('error', error)
}

// API Related Handlers
export function setCollectionRequest(collectionState) {
  return collectionState.merge(Map({loading: true, error: null}))
}
export function setCollectionSuccess(collectionState, data) {
  return collectionState.merge(Map({loading: false, data: fromJS(data), error: null}))
}
export function setCollectionFailure(collectionState, error) {
  return collectionState.merge(Map({loading: false, error}))
}
export function setEntityRequest(entityState) {
  return entityState.merge(Map({loading: true, error: null}))
}
export function setEntitySuccess(entityState, data) {
  return entityState.merge(Map({loading: false, data: fromJS(data), error: null}))
}
export function setEntityFailure(entityState, error) {
  return entityState.merge(Map({loading: false, error}))
}