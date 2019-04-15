import Service from '@ember/service';
import { inject as service } from '@ember/service';
import { computed } from '@ember/object';
import ENV from 'ember-realworld/config/environment';

export default Service.extend({
  store: service(),
  authorizedFetch: service(),

  token: null,
  user: null,
  STORAGE_KEY: 'realworld.ember-octane.token',

  initSession() {
    const storedToken = this.getStoredToken();
    if (storedToken) {
      this.token = storedToken;
      return this.fetchUser();
    }
  },

  isLoggedIn: computed('token', {
    get() {
      return !!this.token;
    }
  }),

  actions: {
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
      // @patocallaghan - It would be nice to encapsulate some of this logic in the User model as a `static` class, but unsure how to access container and store from there
      const login = await fetch(`${ENV.APP.apiHost}/users/login`, {
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
        this.user = this.store.peekRecord('user', userPayload.user.id);
        return this.user;
      }
    },
    logOut() {
      this.removeToken();
    }
  },

  async fetchUser() {
    const { user } = await this.authorizedFetch.fetch('/user');
    this.store.pushPayload({
      users: [user]
    });
    this.user = this.store.peekRecord('user', user.id);
    return this.user;
  },

  getStoredToken() {
    return localStorage.getItem(this.STORAGE_KEY);
  },

  setToken(token) {
    this.token = token;
    localStorage.setItem(this.STORAGE_KEY, token);
  },

  removeToken() {
    this.token = null;
    localStorage.removeItem('realworld.ember-octane.token');
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
