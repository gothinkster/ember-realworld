import Component from '@ember/component';
import { inject as service } from '@ember/service';

export default Component.extend({
  session: service(),
  /**
   * Method executed when "favorite" button is clicked.
   */
  onFavoriteArticle() {},

  /**
   * Method executed when "follow" button is clicked.
   */
  onFollowAuthor() {},
});
