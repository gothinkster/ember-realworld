import Ember from 'ember';
import fetch from 'ember-network/fetch';

import config from '../config/environment';

const headers ={
  'Accept': 'application/json',
  'Content-Type': 'application/json'
};

const {
  RSVP,
  get,
  getProperties,
  inject,
  set
} = Ember;

export default Ember.Controller.extend({
  session: inject.service(),

  init() {
    this._super();

    set(this, 'errors', []);
  },

  errors: null,

  username: '',
  email: '',
  password: '',

  actions: {
    'sign-up'() {
      const body = JSON.stringify({
        user: getProperties(this, 'username', 'email', 'password')
      });

      return fetch(`${config.API.host}/api/users`, { body, headers, method: 'POST' })
        .then((response) => response.json())
        .then((data) => {
          if (data.user) {
            return get(this, 'session').authenticate('authenticator:conduit', data.user)
          } else {
            return RSVP.reject(data.errors);
          }
        })
        .then(() => {
          this.transitionToRoute('home');
        })
        .catch((errors) => {
          debugger;
        });
    }
  }
});
