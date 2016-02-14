import Firebase from 'firebase'
import {config} from './config'

let fb, loginListener

export function connectToNetwork(options) {
  fb = new Firebase('https://' + options.firebaseApp + '.firebaseio.com')
  fb.onAuth(loginListener)
}

export function prepareLoginListener(dispatchAuth) {
  loginListener = dispatchAuth
}
export function loginWithEmail(email, password) {
  return fb
    .authWithPassword({ email, password })
    .then((data, somethingelse) => {
      // Putting this here to clarify that we don't receive a Firebase Snapshot -- just the object
      return data
    })
}
export function signupWithEmail(email, password) {
  return fb
    .createUser({ email, password })
    .then((data) => {
      // Putting this here to clarify that we don't receive a Firebase Snapshot -- just the object
      return data
    })
}
export function get(endpoint) {
  return fb
    .child(endpoint)
    .once('value')
    .then(snapshot => snapshot.val())
}
export function set(endpoint, data) {
  return fb
    .child(endpoint)
    .set(data)
}
export function remove(endpoint) {
  return fb
    .child(endpoint)
    .remove()
}