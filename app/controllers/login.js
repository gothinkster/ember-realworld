import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { task } from 'ember-concurrency';

export default Controller.extend({
  session: service(),
  router: service(),

  email: '',
  password: '',

  logIn: task(function*() {
    this.set('user', yield this.session.logIn(this.email, this.password));
    if (!this.user.errors.length) {
      this.router.transitionTo('home');
    }
  }).drop(),
});
