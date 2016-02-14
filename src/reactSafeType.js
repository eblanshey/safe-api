import * as api from './api'
import { toJSifNeeded } from './utils'
import { defaultEntity, defaultCollection } from './defaultObjects'

/**
 * The callback allows to load data from SAFE based on other data on SAFE. If the
 * callback is provided, then it will be called, with the data provided, or if a collection,
 * it'll be called for each of the resulting array's keys/values.
 * The callback should return a new array of SafeTypes.
 *
 * @param nesting
 * @param propName
 * @param callback
 * @constructor
 */
function SafeType(nesting, propName, callback) {
  this.getPropName = () => propName || `${this.name}_${this.userid}_${this.id}`

  // array = we're fetching an entity or collection,
  // "auth" = we're getting auth-related data
  if (Array.isArray(nesting)) {
    if (nesting.length === 3) {
      this.type = 'entity'
    } else if (nesting.length === 2) {
      this.type = 'collection'
    } else {
      throwError('array must have 2 or 3 arguments')
    }

    this.name = nesting[0]
    this.userid = nesting[1]
    this.id = nesting[2]

    this.nesting = nesting
  } else if (nesting === 'auth') {
    this.type = 'auth'
  }

  this.callback = callback
}

SafeType.prototype.getObjectFromStore = function(store) {
  switch (this.type) {
    case 'entity':
      return toJSifNeeded(store.getIn(['entities', this.name, this.userid, this.id], defaultEntity))
    case 'collection':
      return toJSifNeeded(store.getIn(['collections', this.name, this.userid], defaultCollection))
    case 'auth':
      return toJSifNeeded(store.get('auth'))
  }
}

SafeType.prototype.loadObject = function() {
  switch (this.type) {
    case 'entity':
      api.loadEntity(...this.nesting)
      break
    case 'collection':
      api.loadCollection(...this.nesting)
      break
    case 'auth':
      break
  }
}

export default SafeType
