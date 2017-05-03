import Ember from 'ember';

const { get, inject, set } = Ember;

export default Ember.Controller.extend({
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
        })
        .catch(normalizedErrors => {
          set(this, 'errors', normalizedErrors);
        });
    }
  }
});
