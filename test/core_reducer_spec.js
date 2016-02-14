import {Map, fromJS} from 'immutable'
import * as reducers from '../src/coreReducers.js'
import {expect} from 'chai'

describe('core reducers', () => {

  describe('entity core reducers', () => {

    it('sets entity to loading', () => {
      const state = Map({
        loading: false,
        error: 'An error',
        data: undefined
      })

      const result = reducers.setEntityRequest(state)

      expect(result).to.equal(Map({
        loading: true,
        error: null,
        data: undefined
      }))
    });

    it('sets data for an entity', () => {
      const state = Map({
        loading: true,
        error: 'An error',
        data: undefined
      })

      const result = reducers.setEntitySuccess(state, {var: 'hello'})

      expect(result).to.equal(fromJS({
        loading: false,
        error: null,
        data: {var: 'hello'}
      }))
    });

    it('sets error for an entity', () => {
      const state = fromJS({
        loading: true,
        error: null,
        data: {var: 'hello'}
      })

      const result = reducers.setEntityFailure(state, 'You can\'t do that')

      expect(result).to.equal(fromJS({
        loading: false,
        error: 'You can\'t do that',
        data: {var: 'hello'}
      }))
    });

  });

  describe('collection core reducers', () => {

    it('sets collection as loading', () => {
      const state = Map({
        loading: false,
        error: 'An error',
        data: undefined
      })

      const result = reducers.setCollectionRequest(state)

      expect(result).to.equal(Map({
        loading: true,
        error: null,
        data: undefined
      }))
    })

    it('sets data for an collection', () => {
      const state = Map({
        loading: true,
        error: 'An error',
        data: undefined
      })

      const result = reducers.setCollectionSuccess(state, {var: 'hello'})

      expect(result).to.equal(fromJS({
        loading: false,
        error: null,
        data: {var: 'hello'}
      }))
    });

    it('sets error for an collection', () => {
      const state = fromJS({
        loading: true,
        error: null,
        data: {var: 'hello'}
      })

      const result = reducers.setCollectionFailure(state, 'You can\'t do that')

      expect(result).to.equal(fromJS({
        loading: false,
        error: 'You can\'t do that',
        data: {var: 'hello'}
      }))
    });

  })

})