import Ember from 'ember';

const { String: { capitalize }, get, getProperties, inject, set } = Ember;

export default Ember.Controller.extend({
  session: inject.service(),
  store: inject.service(),

  init() {
    this._super();

    set(this, 'errors', []);
  },

  errors: null,

  username: '',
  email: '',
  password: '',

  _displayErrors(user) {
    const formattedErrors = user
      .get('errors')
      .toArray()
      .map(({ attribute, message }) => `${capitalize(attribute)} ${message}`);

    set(this, 'errors', formattedErrors);
  },

  actions: {
    'sign-up'() {
      const userData = getProperties(this, 'username', 'email', 'password');
      const user = get(this, 'store').createRecord('user', userData);

      return user
        .save()
        .then(() => get(this, 'session').authenticate('authenticator:conduit', user))
        .then(() => {
          this.transitionToRoute('home');
          get(this, 'session').authorize('authorizer:conduit');
        })
        .catch(() => this._displayErrors(user));
    }
  }
});
