import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import window from 'ember-window-mock';

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

  actions: {
    /**
     * If there are changes to the article, confirm with the user before transitioning.
     * If user continues to transition routes, rollback the changes.
     * Rollback changes will unload it from the store if the article is new.
     */
    async willTransition(transition) {
      const {
        session: { user },
      } = this.controller;
      let shouldRollbackAttributes = false;

      /**
       * If there are dirty attributes, comfirm with user whether they want to leave withou saving.
       * Otherwise, just roll back the model attributes, which will unload it from the store.
       */
      if (user.hasDirtyAttributes) {
        if (window.confirm('You have not created the article. Are you sure you want to leave?')) {
          shouldRollbackAttributes = true;
        } else {
          transition.abort();
        }
      } else {
        shouldRollbackAttributes = true;
      }

      if (!transition.isAborted && shouldRollbackAttributes) {
        /**
         * Rollback attributes after transition to prevent the article content in the form to flash.
         */
        await transition;

        user.rollbackAttributes();
      }
    },
  },
});
