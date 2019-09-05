import Service from '@ember/service';
import { inject as service } from '@ember/service';
import { computed } from '@ember/object';
import ENV from 'realworld-ember/config/environment';

const STORAGE_KEY = 'realworld.ember-classic.token';

export default Service.extend({
  store: service(),
  token: null,
  user: null,

  initSession() {
    const storedToken = this.getStoredToken();
    if (storedToken) {
      this.set('token', storedToken);
      return this.fetchUser();
    }
  },

  isLoggedIn: computed('token', function() {
    return !!this.token;
  }),

  register(username, email, password) {
    const user = this.store.createRecord('user', {
      username,
      email,
      password,
    });
    return new Promise(resolve => {
      user
        .save()
        .then(() => {
          this.setToken(user.token);
        })
        .catch(err => err)
        .finally(() => {
          this.set('user', user);
          resolve(user);
        });
    });
  },

  logIn(email, password) {
    return fetch(`${ENV.API.host}/api/users/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user: {
          email,
          password,
        },
      }),
    })
      .then(login => login.json())
      .then(userPayload => {
        if (userPayload.errors) {
          const errors = this.processLoginErrors(userPayload.errors);
          return {
            errors,
          };
        } else {
          this.store.pushPayload({
            users: [userPayload.user],
          });
          this.setToken(userPayload.user.token);
          this.set('user', this.store.peekRecord('user', userPayload.user.id));
          return this.user;
        }
      });
  },

  logOut() {
    this.removeToken();
  },

  fetchUser() {
    return this.fetch('/user').then(({ user }) => {
      // Only push the user into the store if user is truthy
      // Otherwise store will throw errors where a type cannot be looked up on undefined.
      if (user) {
        this.store.pushPayload({
          users: [user],
        });
        this.set('user', this.store.peekRecord('user', user.id));
        return this.user;
      }
    });
  },

  fetch(url, method = 'GET') {
    return fetch(`${ENV.API.host}/api${url}`, {
      method,
      headers: {
        Authorization: this.token ? `Token ${this.token}` : '',
      },
    })
      .then(response => response.json())
      .then(payload => payload);
  },

  getStoredToken() {
    return localStorage.getItem(STORAGE_KEY);
  },

  setToken(token) {
    this.set('token', token);
    localStorage.setItem(STORAGE_KEY, token);
  },

  removeToken() {
    this.set('token', null);
    localStorage.removeItem(STORAGE_KEY);
  },

  processLoginErrors(errors) {
    const loginErrors = [];
    const errorKeys = Object.keys(errors);
    errorKeys.forEach(attribute => {
      errors[attribute].forEach(message => {
        loginErrors.push(`${attribute} ${message}`);
      });
    });
    return loginErrors;
  },
});
