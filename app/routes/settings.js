import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default Route.extend({
  session: service(),

  /**
   * Only allow authenticatd users access to the page. Anonymous users are redirected to login.
   */
  beforeModel() {
    if (!this.session.isLoggedIn) {
      return this.transitionTo('login');
    }
  },
});
