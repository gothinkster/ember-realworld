import Component from '@ember/component';
import { get } from '@ember/object';

export default Component.extend({
  classNames: ['btn', 'btn-sm', 'btn-outline-secondary'],
  classNameBindings: ['following:btn-secondary:btn-outline-secondary'],
  'data-test-favorite-article-button': true,

  /**
   * Method executed when "follow user" button is clicked.
   */
  click() {
    const followAction = get(this, 'followAction');
    followAction(Ember.get(this, 'author'));
  },
});
