import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { task } from 'ember-concurrency';

export default Controller.extend({
  session: service(),
  store: service(),

  user: null,
  username: '',
  email: '',
  password: '',

  register: task(function*() {
    const user = yield this.session.register(this.username, this.email, this.password);
    this.set('user', user);
    if (this.user.isValid) {
      this.router.transitionTo('home');
    }
  }).drop(),
});
