import DS from 'ember-data';
import config from '../config/environment';

const { errorsHashToArray, RESTAdapter } = DS;

export default RESTAdapter.extend({
  host: config.API.host,

  namespace: 'api',

  handleResponse(status, headers, payload) {
    if (this.isInvalid(...arguments)) {
      payload.errors = errorsHashToArray(payload.errors);
    }

    return this._super(...arguments);
  }
});
