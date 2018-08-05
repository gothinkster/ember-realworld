import DS from 'ember-data';
import config from '../config/environment';

const { errorsHashToArray } = DS;

import DataAdapterMixin from 'ember-simple-auth/mixins/data-adapter-mixin';

export default DS.RESTAdapter.extend(DataAdapterMixin, {
  authorizer: 'authorizer:conduit',
  host: config.API.host,

  namespace: 'api',

  headers: Object.freeze({
    Accept: 'application/json',
    'Content-Type': 'application/json'
  }),

  handleResponse(status, headers, payload) {
    if (this.isInvalid(...arguments)) {
      payload.errors = errorsHashToArray(payload.errors);
    }

    return this._super(...arguments);
  }
});
