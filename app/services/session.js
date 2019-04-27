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
      this.token = storedToken;
      return this.fetchUser();
    }
  },

  isLoggedIn: computed('token', function() {
    return !!this.token;
  }),

  async register(username, email, password) {
    const user = this.store.createRecord('user', {
      username,
      email,
      password
    });
    try {
      await user.save();
      this.setToken(user.token);
    } catch {
      // Registration returned errors
    } finally {
      this.user = user;
    }
    return user;
  },

  async logIn(email, password) {
    const login = await fetch(`${ENV.API.host}/api/users/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        user: {
          email,
          password
        }
      })
    });
    const userPayload = await login.json();
    if (userPayload.errors) {
      const errors = this.processLoginErrors(userPayload.errors);
      return { errors };
    } else {
      this.store.pushPayload({
        users: [userPayload.user]
      });
      this.setToken(userPayload.user.token);
      this.set('user', this.store.peekRecord('user', userPayload.user.username));
      return this.user;
    }
  },

  logOut() {
    this.removeToken();
  },

  async fetchUser() {
    const { user } = await this.fetch('/user');
    this.store.pushPayload({
      users: [user]
    });
    this.user = this.store.peekRecord('user', user.id);
    return this.user;
  },

  async fetch(url, method = 'GET') {
    const response = await fetch(`${ENV.API.host}/api${url}`, {
      method,
      headers: {
        Authorization: this.token ? `Token ${this.token}` : ''
      }
    });
    const payload = await response.json();
    return payload;
  },

  getStoredToken() {
    return localStorage.getItem(STORAGE_KEY);
  },

  setToken(token) {
    this.token = token;
    localStorage.setItem(STORAGE_KEY, token);
  },

  removeToken() {
    this.token = null;
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
  }
});
