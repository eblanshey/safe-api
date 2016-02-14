import { connectToNetwork } from './firebaseRepository';

export var config = {
  firebaseApp: null
}

export function setup(options) {
  config = Object.assign(config, options);

  connectToNetwork(options);
}
