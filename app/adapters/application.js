import DS from 'ember-data';
import config from '../config/environment';

const { errorsHashToArray } = DS;

export default DS.RESTAdapter.extend({
  host: config.API.host,

  namespace: 'api',

  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json'
  },

  handleResponse(status, headers, payload) {
    if (this.isInvalid(...arguments)) {
      payload.errors = errorsHashToArray(payload.errors);
    }

    return this._super(...arguments);
  }
});
