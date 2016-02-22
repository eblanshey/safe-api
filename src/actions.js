import * as Firebase from './firebaseRepository'
import * as actionTypes from './actionTypes'
import { toJSifNeeded } from './utils'

import store from './store'

// THUNKS
export function loadEntity(name, userid, id) {
  return (dispatch, getState) => {
    let entity = getState().getIn(['entities', name, userid, id])

    return !entity ?
      dispatch(getEntity(name, userid, id)) :
      toJSifNeeded(entity.get('data'))
  }
}

export function getEntity(name, userid, id) {
  const params = {name, userid, id}

  return (dispatch, getStore) => {
    dispatch(actionWithData(actionTypes.GET_ENTITY_REQUEST, params))

    return Firebase
      .get(generateApiEndpoint('entity', name, userid, id))
      .then((data) => {
          dispatch(actionWithData(actionTypes.GET_ENTITY_SUCCESS, Object.assign({}, {data}, params)))
          return data
        }, (error) => {
          dispatch(actionWithData(actionTypes.GET_ENTITY_FAILURE, Object.assign({}, {error: error.message}, params)))
          throw new Error(error.message)
        }
      )
  }
}

export function putEntity(name, userid, id, data) {
  const params = {name, userid, id, data}

  return (dispatch, getState) => {
    if (!isLoggedIn(getState)) {
      // PUTTING data requires login to the network
      let error = 'You must be logged in before you can do that'
      dispatch(actionWithData(actionTypes.PUT_ENTITY_FAILURE, Object.assign({}, {error}, params)))
      throw new Error(error.message)
    }

    dispatch(actionWithData(actionTypes.PUT_ENTITY_REQUEST, params))

    return Firebase
      .set(generateApiEndpoint('entity', name, userid, id), data)
      .then(() => {
        dispatch(actionWithData(actionTypes.PUT_ENTITY_SUCCESS, Object.assign({}, {data}, params)))
        return data
      }, (error) => {
        dispatch(actionWithData(actionTypes.PUT_ENTITY_FAILURE, Object.assign({}, {error: error.message}, params)))
        throw new Error(error.message)
      }
    )
  }
}

export function deleteEntity(name, userid, id) {
  const params = {name, userid, id}

  return (dispatch, getState) => {
    if (!isLoggedIn(getState)) {
      // PUTTING data requires login to the network
      let error = 'You must be logged in before you can do that'
      dispatch(actionWithData(actionTypes.DELETE_ENTITY_FAILURE, Object.assign({}, {error}, params)))
      throw new Error(error.message)
    }

    dispatch(actionWithData(actionTypes.DELETE_ENTITY_REQUEST, params))

    return Firebase
      .remove(generateApiEndpoint('entity', name, userid, id))
      .then(() => {
        // The data will be null now, which is what the default data is when it doesn't exist on the network
        dispatch(actionWithData(actionTypes.DELETE_ENTITY_SUCCESS, Object.assign({}, {data: null}, params)))
        return null
      }, (error) => {
        dispatch(actionWithData(actionTypes.DELETE_ENTITY_FAILURE, Object.assign({}, {error: error.message}, params)))
        throw new Error(error.message)
      }
    )
  }
}

export function loadCollection(name, userid) {
  return (dispatch, getState) => {
    let collection = getState().getIn(['collections', name, userid])

    return !collection ?
      dispatch(getCollection(name, userid)) :
      toJSifNeeded(collection.get('data'))
  }
}

export function getCollection(name, userid) {
  const params = {name, userid}

  return (dispatch) => {
    dispatch(actionWithData(actionTypes.GET_COLLECTION_REQUEST, params))

    return Firebase
      .get(generateApiEndpoint('collections', name, userid))
      .then((data) => {
        dispatch(actionWithData(actionTypes.GET_COLLECTION_SUCCESS, Object.assign({}, {data}, params)))
        return data
      }, (error) => {
        dispatch(actionWithData(actionTypes.GET_COLLECTION_FAILURE, Object.assign({}, {error: error.message}, params)))
        throw new Error(error.message)
      }
    )
  }
}

export function putCollectionItem(name, userid, id, data) {
  const params = {name, userid, id, data}

  return (dispatch, getState) => {
    if (!isLoggedIn(getState)) {
      // PUTTING data requires login to the network
      let error = 'You must be logged in before you can do that'
      dispatch(actionWithData(actionTypes.PUT_COLLECTION_FAILURE, Object.assign({}, {error}, params)))
      throw new Error(error.message)
    }

    dispatch(actionWithData(actionTypes.PUT_COLLECTION_REQUEST, params))

    return Firebase
      .set(generateApiEndpoint('collection', name, userid, id), data)
      .then(() => {
          dispatch(actionWithData(actionTypes.PUT_COLLECTION_SUCCESS, Object.assign({}, {data}, params)))
          // Return the item we put into the collection, not the whole collection
          return data
        }, (error) => {
          dispatch(actionWithData(actionTypes.PUT_COLLECTION_FAILURE, Object.assign({}, {error: error.message}, params)))
          throw new Error(error.message)
        }
      )
  }
}

export function deleteCollectionItem(name, userid, id) {
  const params = {name, userid, id}

  return (dispatch, getState) => {
    if (!isLoggedIn(getState)) {
      // PUTTING data requires login to the network
      let error = 'You must be logged in before you can do that'
      dispatch(actionWithData(actionTypes.DELETEITEM_COLLECTION_FAILURE, Object.assign({}, {error}, params)))
      throw new Error(error.message)
    }

    dispatch(actionWithData(actionTypes.DELETEITEM_COLLECTION_REQUEST, params))

    return Firebase
      .remove(generateApiEndpoint('collection', name, userid, id))
      .then(() => {
        dispatch(actionWithData(actionTypes.DELETEITEM_COLLECTION_SUCCESS, Object.assign({}, params)))
        return null
      }, (error) => {
        dispatch(actionWithData(actionTypes.DELETEITEM_COLLECTION_FAILURE, Object.assign({}, {error: error.message}, params)))
        throw new Error(error.message)
      }
    )
  }
}

export function deleteEntireCollection(name, userid) {
  const params = {name, userid}

  return (dispatch, getState) => {
    if (!isLoggedIn(getState)) {
      // PUTTING data requires login to the network
      let error = 'You must be logged in before you can do that'
      dispatch(actionWithData(actionTypes.DELETEWHOLE_COLLECTION_FAILURE, Object.assign({}, {error}, params)))
      throw new Error(error.message)
    }

    dispatch(actionWithData(actionTypes.DELETEWHOLE_COLLECTION_REQUEST, params))

    return Firebase
      .remove(generateApiEndpoint('collection', name, userid))
      .then(() => {
        dispatch(actionWithData(actionTypes.DELETEWHOLE_COLLECTION_SUCCESS, Object.assign({}, params)))
        return null
      }, (error) => {
        dispatch(actionWithData(actionTypes.DELETEWHOLE_COLLECTION_FAILURE, Object.assign({}, {error: error.message}, params)))
        throw new Error(error.message)
      }
    )
  }
}

// SIGNUP/LOGIN
export function submitEmailLogin(email, password) {
  return (dispatch) => doLogin(dispatch, email, password)
}

export function signup(email, password) {
  return (dispatch) => {
    dispatch(signupRequest())

    return Firebase
      .signupWithEmail(email, password)
      .then(authData => {
        // We won't actually use the authData here. They still need to log in.
        dispatch(signupSuccess())
        return doLogin(dispatch, email, password)
      }, error => {
        dispatch(signupFailure(error.message))
        throw new Error(error.message)
      })
  }
}

function doLogin(dispatch, email, password) {
  dispatch(loginRequest())

  return Firebase
    .loginWithEmail(email, password)
    .then(authData => {
      // Don't dispatch here, we have a global listener being used in the firebase repository.
      // That's because when the app is reloaded, the user is auto-logged back in without a form.
      // This listener will know to set login data, even when using this form.
      return authData.uid
    }, error => {
      dispatch(loginFailure(error.message))
      throw new Error(error.message)
    })
}

/**
 * Directory ends up being like:
 * users/userid/entities/entityname/id
 * e.g. users/eblanshey/entities/posts/482223
 *
 * @param dataType
 * @param name
 * @param userid
 * @param id
 * @returns string
 */
function generateApiEndpoint(dataType, name, userid, id) {
  dataType = dataType === 'entity' ? 'entities' : 'collections'
  return `users/${userid}/${dataType}/${name}`+(id ? `/${id}` : '')
}

// For now we use this to dispatch basic object actions, eventually create a dedicated function
// for each action so that we can test them
function actionWithData(actionName, data) {
  return Object.assign({}, {type: actionName}, data)
}

// Login
function loginRequest() {
  return {
    type: actionTypes.LOGIN_REQUEST
  }
}
function loginFailure(error) {
  return {
    type: actionTypes.LOGIN_FAILURE,
    error
  }
}
export function loginSuccess(authData) {
  return {
    type: actionTypes.LOGIN_SUCCESS,
    authData
  }
}

// Signup
function signupRequest() {
  return {
    type: actionTypes.SIGNUP_REQUEST
  }
}
function signupSuccess() {
  return {
    type: actionTypes.SIGNUP_SUCCESS
  }
}
function signupFailure(error) {
  return {
    type: actionTypes.SIGNUP_FAILURE,
    error
  }
}

// Helper
function isLoggedIn(getState) {
  return getState().getIn(['auth', 'userid']) ? true : false
}