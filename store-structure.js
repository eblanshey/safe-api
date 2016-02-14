let store = {
  entities: {
    entityName: { // e.g. "threads"
      userId: { // e.g. "c4630597-1c32-4bc1-8385-f66e3fa93a7b"
        entityId: { // e.g. 'b2509e6d-1a7f-44f4-96d7-06c1df9efdef'
          loading: false,
          error: null, // String if available. Reverts to null when loading or putting entity.
          data: {} // data as provided, can be object, string, array, etc.
                   // default (if not fetched yet): undefined. doesn't exist: null.
        }
      }
    }
  },
  collections: {
    collectionName: { // e.g. "categories"
      userId: {
        loading: false,
        error: null, // String if available. Reverts to null when loading or putting collections.
        data: {} // object. default: undefined. doesn't exist: null.
      }
    }
  },
  auth: {
    isLoggingIn: false,
    authData: null, // firebase auth data, no need for this really
    userid: null, // can be used to check if logged in
    error: null, // String if available. Reverts to null when signing up or logging in.
    isSigningUp: false,
    didCreateLogin: false // true after signing up
  }
};