import Controller from '@ember/controller';
import { inject as service } from '@ember/service';

export default Controller.extend({
  session: service(),
  store: service(),

  user: null,
  username: '',
  email: '',
  password: '',

  actions: {
    async register() {
      const user = await this.session.register(this.username, this.email, this.password);
      this.set('user', user);
      if (this.user.isValid) {
        this.router.transitionTo('home');
      }
    }
  }
});
