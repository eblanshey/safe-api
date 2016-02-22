import React from 'react'
import * as redux from 'react-redux'
import { Component } from 'react'

import { defaultEntity, defaultCollection } from './defaultObjects'
import SafeType from './reactSafeType'
import * as api from './api'
import store from './store'

export function h(...args) {
  return new SafeType(...args)
}

export function connectToSafe(mapPropsToSafe) {
  if (typeof mapPropsToSafe !== 'function') {
    throwError('you must provide a closure that returns an array of SafeType objects')
  }

  return function(WrappedComponent) {
    return class extends Component {
      constructor(props, context) {
        super(props, context)

        this.state = {}

        this.storeChangeHandler = this.storeChangeHandler.bind(this)

        // Compute state now in order to make sure the user has access to the SAFE props requested,
        // even if they are empty.
        this.state = computeState.call(this, mapPropsToSafe(props))
      }

      componentDidMount() {
        this.unsubscribe = store.subscribe(this.storeChangeHandler)

        // Compute state after mounting in order to fetch the objects from SAFE,
        // as that can be done only after mounting.
        this.setState(computeState.call(this, mapPropsToSafe(this.props)))
      }

      componentWillUnmount() {
        this.unsubscribe()
      }

      storeChangeHandler() {
        if (this.unsubscribe) {
          this.setState(computeState.call(this, mapPropsToSafe(this.props)))
        }
      }

      componentWillReceiveProps(nextProps) {
        if (!shallowEqual(nextProps, this.props)) {
          this.setState(computeState.call(this, mapPropsToSafe(nextProps)))
        }
      }

      getRef() {
        return this.refs.wrappedRef
      }

      render() {
        return <WrappedComponent {...this.props} {...this.state} api={api} ref="wrappedRef" />
      }
    }
  }
}

function computeState(arrayOfObjects, state = {}) {
  arrayOfObjects.forEach((safeType) => {
    setStateFromSafeType.call(this, state, safeType)
  })

  return state
}

function setStateFromSafeType(state, safeType) {
  if (!safeType || typeof safeType !== 'object' || !safeType.getPropName) {
    throwError('Every element in the returned array of objects must be an instance of SafeType. Make sure to use the "h" helper.')
  }

  // Make sure it's loaded
  if (this.unsubscribe) {
    safeType.loadObject()
  }

  let propName = safeType.getPropName(),
    objectFromStore = safeType.getObjectFromStore(store.getState())

  // If the propname ends with [], then the user wants an array of entities
  if (propName.endsWith('{}')) {
    propName = propName.slice(0, -2)
    if (!state[propName]) {
      state[propName] = {}
    }

    // The key for each entity will be its id
    state[propName][safeType.id] = objectFromStore
  } else {
    state[propName] = objectFromStore
  }


  if (safeType.callback && objectFromStore.data) {
    if (safeType.type === 'entity') {
      computeState.call(this, safeType.callback(objectFromStore.data), state)
    } else {
      for (let key in objectFromStore.data) {
        computeState.call(this, safeType.callback(objectFromStore.data[key], key), state)
      }
    }
  }
}

function throwError(message) {
  throw new Error(message)
}

/**
 * @source https://github.com/gaearon/react-pure-render/blob/master/src/shallowEqual.js
 * @param objA
 * @param objB
 * @returns {boolean}
 */
function shallowEqual(objA, objB) {
  if (objA === objB) {
    return true;
  }

  if (typeof objA !== 'object' || objA === null ||
    typeof objB !== 'object' || objB === null) {
    return false;
  }

  var keysA = Object.keys(objA);
  var keysB = Object.keys(objB);

  if (keysA.length !== keysB.length) {
    return false;
  }

  // Test for A's keys different from B.
  var bHasOwnProperty = Object.prototype.hasOwnProperty.bind(objB);
  for (var i = 0; i < keysA.length; i++) {
    if (!bHasOwnProperty(keysA[i]) || objA[keysA[i]] !== objB[keysA[i]]) {
      return false;
    }
  }

  return true;
}