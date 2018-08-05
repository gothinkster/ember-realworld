import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { oneWay } from '@ember/object/computed';

export default Controller.extend({
  session: service(),
  currentUser: oneWay('session.session.content.authenticated'),
  isAuthenticated: oneWay('session.isAuthenticated'),

  actions: {
    'sign-out'() {
      this.session.invalidate();
    }
  }
});
