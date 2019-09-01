import DS from 'ember-data';
import config from '../config/environment';
import { inject as service } from '@ember/service';
import { computed } from '@ember/object';

const { errorsHashToArray, RESTAdapter } = DS;

export default RESTAdapter.extend({
  session: service(),

  host: config.API.host,

  namespace: 'api',

  headers: computed('session.token', function() {
    const headers = {};

    if (this.session.token) {
      headers.Authorization = `Token ${this.session.token}`;
    }

    return headers;
  }),

  handleResponse(status, headers, payload) {
    if (this.isInvalid(...arguments)) {
      payload.errors = errorsHashToArray(payload.errors);
    }

    return this._super(...arguments);
  },
});
