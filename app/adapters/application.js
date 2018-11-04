import DS from 'ember-data';
import config from '../config/environment';
import { isPresent } from '@ember/utils';
import DataAdapterMixin from 'ember-simple-auth/mixins/data-adapter-mixin';

const { errorsHashToArray } = DS;

export default DS.RESTAdapter.extend(DataAdapterMixin, {
  host: config.API.host,

  namespace: 'api',

  headers: Object.freeze({
    Accept: 'application/json',
    'Content-Type': 'application/json'
  }),

  authorize(xhr) {
    const { access_token } = this.get('session.data.authenticated');
    if (isPresent(access_token)) {
      xhr.setRequestHeader('Authorization', `Token ${access_token}`);
    }
  },

  handleResponse(status, headers, payload) {
    if (this.isInvalid(...arguments)) {
      payload.errors = errorsHashToArray(payload.errors);
    }

    return this._super(...arguments);
  }
});
