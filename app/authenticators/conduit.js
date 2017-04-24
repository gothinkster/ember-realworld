import Ember from 'ember';
import BaseAuthenticator from 'ember-simple-auth/authenticators/base';

import fetch from 'ember-network/fetch';
import config from '../config/environment';

const { RSVP } = Ember;

const headers ={
  'Accept': 'application/json',
  'Content-Type': 'application/json'
};

export default BaseAuthenticator.extend({
  /**
   * Authenticate a user
   *
   * When a user is registered, this method will be passed the new User object,
   * so we can just grab the token off of that.
   *
   * If the user is logging into an existing account, we can take the email and password
   * and log them in.
   */
  authenticate({ token, email, password }) {
    if (token) {
      return RSVP.resolve({ token });
    }

    const body = JSON.stringify({
      user: { email, password }
    });

    return fetch(`${config.API.host}/api/users/login`, { body, headers, method: 'POST' })
      .then((response) => response.json())
      .then((data) => {
        if (data.errors) {
          return RSVP.reject(data.errors);
        }

        return RSVP.resolve(data.user);
      });
  },

  restore({ token }) {
    if (!token) {
      return RSVP.reject();
    }

    const fullHeaders = Object.assign({}, headers, {
      authorization: `Token ${token}`
    })

    return fetch(`${config.API.host}/api/user`, { headers: fullHeaders })
      .then((response) => response.json())
      .then((data) => {
        if (data.errors) {
          return RSVP.reject(data.errors);
        }

        return data.user;
      });
  }
});
