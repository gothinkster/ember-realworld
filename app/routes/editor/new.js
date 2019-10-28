import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import window from 'ember-window-mock';

export default Route.extend({
  session: service(),
  store: service(),

  templateName: 'editor/new',

  /**
   * Only authenticated users are allowed to visit this page.
   * Transition anonymous users to `login` route.
   * @override
   */
  beforeModel() {
    if (!this.session.isLoggedIn) {
      this.transitionTo('login');
    }
  },

  /**
   * Create a new article record used in the page.
   */
  model() {
    return this.store.createRecord('article');
  },

  actions: {
    /**
     * If there are changes to the article, confirm with the user before transitioning.
     * If user continues to transition routes, rollback the changes.
     * Rollback changes will unload it from the store if the article is new.
     */
    async willTransition(transition) {
      const { draftArticle } = this.controller;
      let shouldRollbackAttributes = false;

      /**
       * If there are dirty attributes, comfirm with user whether they want to leave withou saving.
       * Otherwise, just roll back the model attributes, which will unload it from the store.
       */
      if (draftArticle.hasDirtyAttributes) {
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

        draftArticle.rollbackAttributes();
      }
    },
  },
});
