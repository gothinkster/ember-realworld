import Controller from '@ember/controller';
import { inject as service } from '@ember/service';

export default Controller.extend({
  session: service(),
  router: service(),

  email: '',
  password: '',

  actions: {
    async logIn() {
      this.set('user', await this.session.logIn(this.email, this.password));
      if (!this.user.errors.length) {
        this.router.transitionTo('home');
      }
    }
  }
});
