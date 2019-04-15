import Service from '@ember/service';
import { inject as service } from '@ember/service';
import ENV from 'ember-realworld/config/environment';

export default Service.extend({
  session: service(),

  async fetch(url, method = 'GET') {
    const response = await fetch(`${ENV.APP.apiHost}${url}`, {
      method,
      headers: {
        Authorization: this.session.token ? `Token ${this.session.token}` : ''
      }
    });
    const payload = await response.json();
    return payload;
  }
});
