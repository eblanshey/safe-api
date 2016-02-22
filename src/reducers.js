import {Map, fromJS} from 'immutable'

import * as reducers from './coreReducers'
import { defaultEntity, defaultCollection } from './defaultObjects'

function auth(authState, action) {
  switch(action.type) {
    case 'LOGIN_REQUEST':
      return reducers.loginRequest(authState)
    case 'LOGIN_SUCCESS':
      return reducers.loginSuccess(authState, action.authData)
    case 'LOGIN_FAILURE':
      return reducers.loginFailure(authState, action.error)
    case 'SIGNUP_REQUEST':
      return reducers.signupRequest(authState)
    case 'SIGNUP_SUCCESS':
      return reducers.signupSuccess(authState)
    case 'SIGNUP_FAILURE':
      return reducers.signupFailure(authState, action.error)
  }

  return authState
}

function collections(collectionState, action) {
  if (
    [
      'GET_COLLECTION_REQUEST', 'GET_COLLECTION_SUCCESS', 'GET_COLLECTION_FAILURE',
      'PUT_COLLECTION_REQUEST', 'PUT_COLLECTION_SUCCESS', 'PUT_COLLECTION_FAILURE',
      'DELETEITEM_COLLECTION_REQUEST', 'DELETEITEM_COLLECTION_SUCCESS', 'DELETEITEM_COLLECTION_FAILURE',
      'DELETEWHOLE_COLLECTION_REQUEST', 'DELETEWHOLE_COLLECTION_SUCCESS', 'DELETEWHOLE_COLLECTION_FAILURE',
    ].indexOf(action.type) < 0
  ) {
    return collectionState
  }

  const defaultCollection = Map(defaultCollection)

  const {name, userid, id, data, error} = action

  if (action.type.indexOf('REQUEST') > -1) {
    return collectionState.updateIn([name, userid], defaultCollection, collection => reducers.setCollectionRequest(collection))
  } else if (action.type.indexOf('SUCCESS') > -1) {
    let request = action.type.substr(0, action.type.indexOf('_')),
      newData = null,
      oldData = collectionState.getIn([name, userid, 'data'], undefined)

    // If a new item was PUT, it needs to be added to the existing collection of apps, if available.
    // If no collection exists, then do NOT add the new data to an empty collection, as the collection
    // has not yet been fetched by the user. We will return the collection state as is -- it will
    // be loaded by the user when he wants it. Same goes for deletes:
    // don't change anything if it hasn't been fetched yet.
    if (['PUT', 'DELETEITEM', 'DELETEWHOLE'].indexOf(request) > -1 && oldData === undefined) {
      return collectionState
    }

    if (request === 'PUT') {
      if (oldData === null)
        oldData = Map()

      newData = oldData.set(id, fromJS(data))
    } else if (request === 'GET') {
      // If we fetched a collection, then the data returned is the entire collection
      newData = action.data
    } else if (request === 'DELETEITEM') {
      if (oldData) {
        newData = oldData.delete(action.id)
      }
      // otherwise keep newData as null
    } else if (request === 'DELETEWHOLE') {
      // keep newData as null
    }

    return collectionState.updateIn([name, userid], defaultCollection, collection => reducers.setCollectionSuccess(collection, newData))
  } else if (action.type.indexOf('FAILURE') > -1) {
    return collectionState.updateIn([name, userid], defaultCollection, collection => reducers.setCollectionFailure(collection, error))
  } else {
    throw new Error('Got invalid type', action.type)
  }
}

function entities(entityState, action) {
  if (
    [
      'GET_ENTITY_REQUEST', 'GET_ENTITY_SUCCESS', 'GET_ENTITY_FAILURE',
      'PUT_ENTITY_REQUEST', 'PUT_ENTITY_SUCCESS', 'PUT_ENTITY_FAILURE',
      'DELETE_ENTITY_REQUEST', 'DELETE_ENTITY_SUCCESS', 'DELETE_ENTITY_FAILURE',
    ].indexOf(action.type) < 0
  ) {
    return entityState
  }

  const defaultEntity = Map(defaultEntity),
    {name, userid, id, data, error} = action

  if (action.type.includes('REQUEST')) {
    return entityState.updateIn([name, userid, id], defaultEntity, entity => reducers.setEntityRequest(entity))
  } else if (action.type.includes('SUCCESS')) {
    return entityState.updateIn([name, userid, id], defaultEntity, entity => reducers.setEntitySuccess(entity, data))
  } else if (action.type.includes('FAILURE')) {
    return entityState.updateIn([name, userid, id], defaultEntity, entity => reducers.setEntityFailure(entity, error))
  } else {
    throw new Error('Got invalid type', action.type)
  }
}

const DefaultState = fromJS({
  entities: {},
  collections: {},
  auth: {
    isLoggingIn: false,
    authData: null, // firebase auth data
    userid: null,
    error: null,
    isSigningUp: false,
    didCreateLogin: false
  }
})

export default function(state = DefaultState, action) {
  // Meh, no magic use of "combineReducers" here
  return state
    .update('auth', authState => auth(authState, action))
    .update('collections', collectionState => collections(collectionState, action))
    .update('entities', entityState => entities(entityState, action))
}