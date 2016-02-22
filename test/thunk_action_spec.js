import {expect} from 'chai'
import {fromJS, Map} from 'immutable'
import sinon from 'sinon'
import {restore} from './test_utils'
import * as Firebase from '../src/firebaseRepository'
import store from '../src/store'
import * as thunks from '../src/actions.js'
import { createTestStore } from './test_utils'

let dispatch = (arg) => arg

describe('thunk actions', () => {

  describe('entities', () => {

    it('gets an entity', (done) => {
      const firebaseGet = sinon.stub(Firebase, 'get').resolves({myvar: 'hello'})

      const oldStore = { entities: {
        apps: {
          myuserid: {
            myappid: {
              loading: false,
              error: 'my error',
              data: undefined
            }
          }
        }
      }}
      const testStore = createTestStore(oldStore)

      testStore.dispatch(thunks.getEntity('apps', 'myuserid', 'myappid'))
        .then(data => {
          expect(data).to.eql({myvar: 'hello'})
          const newObject = testStore.getState().getIn(['entities', 'apps', 'myuserid', 'myappid']).toJS();
          expect(newObject).to.eql({
            loading: false,
            error: null,
            data: {myvar: 'hello'}
          })
          firebaseGet.restore()
          done()
        })
        .catch((error) => {
          done(error)
        })
    })

    it('deletes an entity', (done) => {
      const firebaseRemove = sinon.stub(Firebase, 'remove').resolves(null)

      const oldStore = {
        entities: {
          apps: {
            myuserid: {
              myappid: {
                loading: false,
                error: 'my error',
                data: 'data'
              }
            }
          }
        },
        auth: {
          userid: 'id'
        }
      }
      const testStore = createTestStore(oldStore)

      testStore.dispatch(thunks.deleteEntity('apps', 'myuserid', 'myappid'))
        .then(data => {
          expect(data).to.eql(null)

          const newObject = testStore.getState().getIn(['entities', 'apps', 'myuserid', 'myappid']).toJS();
          expect(newObject).to.eql({
            loading: false,
            error: null,
            data: null
          })

          firebaseRemove.restore()
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

      const oldStore = {
        collections: {
          apps: {
            myuserid: {
              loading: false,
              error: 'my error',
              data: undefined
            }
          }
        }
      }
      const testStore = createTestStore(oldStore)

      testStore.dispatch(thunks.getCollection('apps', 'myuserid'))
        .then(data => {
          expect(data).to.eql({myvar: 'hello'})

          const newObject = testStore.getState().getIn(['collections', 'apps', 'myuserid']).toJS()

          expect(newObject).to.eql({
            loading: false,
            error: null,
            data: {myvar: 'hello'}
          })

          firebaseGet.restore()
          done()
        })
        .catch((error) => {
          done(error)
        })
    })

    it('deletes a collection item', (done) => {
      const firebaseRemove = sinon.stub(Firebase, 'remove').resolves(null)

      const oldStore = {
        collections: {
          apps: {
            myuserid: {
              loading: false,
              error: 'my error',
              data: {
                myappid: {
                  hi: 'there'
                },
                deleteme: {
                  not: 'here'
                }
              }
            }
          }
        },
        auth: {
          userid: 'id'
        }
      }
      const testStore = createTestStore(oldStore)

      testStore.dispatch(thunks.deleteCollectionItem('apps', 'myuserid', 'deleteme'))
        .then(data => {
          expect(data).to.eql(null)

          const newObject = testStore.getState().getIn(['collections', 'apps', 'myuserid']).toJS();
          expect(newObject).to.eql({
            loading: false,
            error: null,
            data: {
              myappid: {
                hi: 'there'
              }
            }
          })

          firebaseRemove.restore()
          done()
        })
        .catch((error) => {
          done(error)
        })
    })

    it('deletes an entire collection', (done) => {
      const firebaseRemove = sinon.stub(Firebase, 'remove').resolves(null)

      const oldStore = {
        collections: {
          apps: {
            myuserid: {
              loading: false,
              error: 'my error',
              data: {
                myappid: {
                  hi: 'there'
                },
                deleteme: {
                  not: 'here'
                }
              }
            }
          }
        },
        auth: {
          userid: 'id'
        }
      }
      const testStore = createTestStore(oldStore)

      testStore.dispatch(thunks.deleteEntireCollection('apps', 'myuserid'))
        .then(data => {
          expect(data).to.eql(null)

          const newObject = testStore.getState().getIn(['collections', 'apps', 'myuserid']).toJS();
          expect(newObject).to.eql({
            loading: false,
            error: null,
            data: null
          })

          firebaseRemove.restore()
          done()
        })
        .catch((error) => {
          done(error)
        })
    })

  })

})