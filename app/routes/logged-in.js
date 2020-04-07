import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class LoggedInRoute extends Route {
  @service session;

  beforeModel() {
    if (!this.session.isLoggedIn) {
      this.transitionTo('login');
    }
  }
}
