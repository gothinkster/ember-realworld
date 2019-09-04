import Component from '@ember/component';
import { inject as service } from '@ember/service';

export default Component.extend({
  session: service(),

  /**
   * Flag to help determine whether to render a logged-in user state or not
   * @type {Boolean}
   */
  isLoggedIn: false,

  /**
   * Method executed when "favorite" button is clicked.
   * @method
   * @name onFavoriteArticle
   * @param {Object} article The article record to be favorited
   */

  /**
   * Method executed when "follow" button is clicked.
   * @method
   * @name onFollowAuthor
   * @param {Object} author The author record that is followed
   */
});
