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
});
