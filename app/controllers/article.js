import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { computed } from '@ember/object';
import { sort } from '@ember/object/computed';
import marked from 'marked';
import { htmlSafe } from '@ember/template';

export default Controller.extend({
  session: service(),
  store: service(),

  /**
   * Sort the comments in descending order by ID because that's how the order the API provides.
   * Otherwise new comments will be displayed in ascending order because that's how new comments
   * are automatically added to the store.
   *
   * @type {Array}
   */
  commentsSorting: Object.freeze(['id:desc']),

  /**
   * Comments sorted by `commentsSorting` key.
   * @returns {Array}
   */
  comments: sort('model.comments', 'commentsSorting'),

  /**
   * Article body is converted to markdown and returned as an HTMLSafe string.
   * @returns {String}
   */
  articleBody: computed('model', function() {
    return htmlSafe(marked(this.model.body));
  }),

  /**
   * Computed property for creating new comments.
   * The default will be an empty string. When the model changes, the value will automatically reset.
   * Automatically resetting is necessary since the controller is a singleton. Otherwise previously
   * typed comments will be visible when changing pages.
   *
   * @returns {String}
   */
  newComment: computed('model', {
    get() {
      return '';
    },
    set(key, value) {
      return value;
    },
  }),

  /**
   * Validate the new comment to prevent creating empty comments.
   * @returns {Boolean}
   */
  isNewCommentValid: computed('newComment', function() {
    /**
     * Make sure the string isn't just whitespace.
     */
    return !!this.newComment.trim();
  }),

  actions: {
    async createComment(article, message) {
      await this.store
        .createRecord('comment', {
          article,
          body: message,
        })
        .save();

      // Clear the `newComment` since the new comment has been created.
      this.set('newComment', '');
    },

    async deleteComment(comment) {
      return comment.destroyRecord();
    },

    async favoriteArticle(article) {
      return article.get('favorited') ? article.unfavorite() : article.favorite();
    },

    async followAuthor(author) {
      return author.get('following') ? author.unfollow() : author.follow();
    },
  },
});
