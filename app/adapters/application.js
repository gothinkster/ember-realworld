import DS from 'ember-data';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';
import ENV from 'ember-realworld/config/environment';
const { errorsHashToArray, RESTAdapter } = DS;

export default RESTAdapter.extend({
  session: service(),

  host: ENV.APP.apiHost,

  headers: computed('session.token', {
    get() {
      return {
        Authorization: this.session.token ? `Token ${this.session.token}` : ''
      };
    }
  }),

  handleResponse(status, headers, payload) {
    if (this.isInvalid(...arguments)) {
      payload.errors = errorsHashToArray(payload.errors);
    }

    return this._super(...arguments);
  }
});
