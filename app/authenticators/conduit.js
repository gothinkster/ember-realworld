import { getProperties } from '@ember/object';
import { inject as service } from '@ember/service';
import { capitalize } from '@ember/string';
import fetch from 'fetch';
import BaseAuthenticator from 'ember-simple-auth/authenticators/base';
import { reject, resolve } from 'rsvp';
import config from '../config/environment';

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
  store: service(),

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
      return resolve(user.serialize());
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
      return reject();
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
      return reject(normalizeErrors(data.errors));
    }

    const user = this._pushCurrentUserToStore(data);

    return resolve(user.serialize());
  },

  /**
   * Pushes the data from the server into Ember Data and returns the current
   * user record
   */
  _pushCurrentUserToStore(userPayload) {
    this.store.pushPayload(userPayload);

    return this.store.peekRecord('user', userPayload.user.username);
  }
});
