import Ember from 'ember';
import BaseAuthenticator from 'ember-simple-auth/authenticators/base';

import fetch from 'ember-network/fetch';
import config from '../config/environment';

const { RSVP, String: { capitalize }, get, getProperties, inject } = Ember;

const headers = {
  Accept: 'application/json',
  'Content-Type': 'application/json'
};

/**
 * Normalizes the errors from the object form that the API
 * returns into an Array of strings that are ready to display
 *
 * @param {object} errors
 * @return {Array<String>}
 */
function normalizeErrors(errors) {
  return Object.keys(errors).map(key => {
    const value = errors[key];
    return `${capitalize(key)} ${value}`;
  });
}

export default BaseAuthenticator.extend({
  store: inject.service(),

  /**
   * Authenticate a user
   *
   * When a user is registered, this method will be passed the new User object,
   * so we can just grab the token off of that.
   *
   * If the user is logging into an existing account, we can take the email and password
   * and log them in.
   */
  authenticate(user) {
    const { token, email, password } = getProperties(user, 'token', 'email', 'password');

    // If the user is already logged in, store their serialized state
    if (token) {
      return RSVP.resolve(user.serialize());
    }

    // Otherwise, fetch their state, log them in, and push that record into Ember Data
    const body = JSON.stringify({
      user: { email, password }
    });

    return fetch(`${config.API.host}/api/users/login`, { body, headers, method: 'POST' })
      .then(response => response.json())
      .then(this._handleApiResponse.bind(this));
  },

  restore({ token }) {
    if (!token) {
      return RSVP.reject();
    }

    const fullHeaders = Object.assign({}, headers, {
      authorization: `Token ${token}`
    });

    return fetch(`${config.API.host}/api/user`, { headers: fullHeaders, method: 'GET' })
      .then(response => response.json())
      .then(this._handleApiResponse.bind(this));
  },

  _handleApiResponse(data) {
    if (data.errors) {
      return RSVP.reject(normalizeErrors(data.errors));
    }

    const user = this._pushCurrentUserToStore(data);

    return RSVP.resolve(user.serialize());
  },

  /**
   * Pushes the data from the server into Ember Data and returns the current
   * user record
   */
  _pushCurrentUserToStore(userPayload) {
    const store = get(this, 'store');
    store.pushPayload(userPayload);

    return store.peekRecord('user', userPayload.user.username);
  }
});
