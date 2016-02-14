import chai from 'chai';
import chaiImmutable from 'chai-immutable';
import sinon from 'sinon';
// sinon as promised only needs to be loaded once to be used everywhere
import sinonAsPromise from 'sinon-as-promised';

chai.use(chaiImmutable);
chai.config.truncateThreshold = 0;
