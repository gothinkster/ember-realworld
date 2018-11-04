import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { set } from '@ember/object';

export default Controller.extend({
  session: service(),

  errors: null,

  email: '',
  password: '',

  init() {
    this._super(...arguments);
    set(this, 'errors', []);
  },

  actions: {
    login(email, password) {
      return this.session
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
