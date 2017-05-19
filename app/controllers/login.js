import Ember from 'ember';

const { Controller, get, inject, set } = Ember;

export default Controller.extend({
  session: inject.service(),

  init() {
    this._super();

    set(this, 'errors', []);
  },

  errors: null,

  email: '',
  password: '',

  actions: {
    login(email, password) {
      return get(this, 'session')
        .authenticate('authenticator:conduit', { email, password })
        .then(() => {
          this.transitionToRoute('home');
          get(this, 'session').authorize('authorizer:conduit');
        })
        .catch(normalizedErrors => {
          set(this, 'errors', normalizedErrors);
        });
    }
  }
});
