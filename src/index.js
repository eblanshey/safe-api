import * as api from './api.js'
import { loginSuccess } from './actions'
import store from './store.js'
import { setup } from './config'
import { h, connectToSafe } from './reactHelpers'
import { prepareLoginListener } from './firebaseRepository'

prepareLoginListener(authData => store.dispatch(loginSuccess(authData)))

export {
  setup,
  api,
  h,
  connectToSafe
}