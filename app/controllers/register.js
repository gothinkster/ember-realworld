import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { set } from '@ember/object';
import { getProperties } from '@ember/object';
import { capitalize } from '@ember/string';

export default Controller.extend({
  session: service(),
  store: service(),

  errors: null,

  username: '',
  email: '',
  password: '',

  init() {
    this._super();

    set(this, 'errors', []);
  },

  actions: {
    'sign-up'() {
      const userData = getProperties(this, 'username', 'email', 'password');
      const user = this.store.createRecord('user', userData);

      return user
        .save()
        .then(() => this.session.authenticate('authenticator:conduit', user))
        .then(() => this.transitionToRoute('index'))
        .catch(() => this._displayErrors(user));
    }
  },
  _displayErrors(user) {
    const formattedErrors = user
      .get('errors')
      .toArray()
      .map(({ attribute, message }) => `${capitalize(attribute)} ${message}`);

    set(this, 'errors', formattedErrors);
  }
});
