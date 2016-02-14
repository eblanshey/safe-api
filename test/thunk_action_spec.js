import {expect} from 'chai'
import {fromJS, Map} from 'immutable'
import sinon from 'sinon'
import {restore} from './test_utils'
import * as Firebase from '../src/firebaseRepository'
import * as thunks from '../src/actions.js'

let dispatch = (arg) => arg

describe('thunk actions', () => {

  describe('entities', () => {

    it('gets an entity', (done) => {
      const firebaseGet = sinon.stub(Firebase, 'get').resolves({myvar: 'hello'})

      //console.log(thunks.getEntity('apps', 'myuserid', 'myappid'));
      thunks.getEntity('apps', 'myuserid', 'myappid')(dispatch)
        .then(data => {
          expect(data).to.eql({myvar: 'hello'})
          firebaseGet.restore()
          done()
        })
        .catch((error) => {
          done(error)
        })
    })

  })

  describe('collections', () => {

    it('gets a collection', (done) => {
      const firebaseGet = sinon.stub(Firebase, 'get').resolves({myvar: 'hello'})

      thunks.getCollection('apps', 'myuserid')(dispatch)
        .then(data => {
          expect(data).to.eql({myvar: 'hello'})
          firebaseGet.restore()
          done()
        })
        .catch((error) => {
          done(error)
        })
    })

  })

})