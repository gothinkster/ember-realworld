import Component from '@ember/component';
import { get } from '@ember/object';

export default Component.extend({
  tagName: ['button'],
  classNames: ['btn', 'btn-sm'],
  classNameBindings: ['following:btn-secondary:btn-outline-secondary'],
  'data-test-follow-author-button': true,

  /**
   * Method executed when "follow user" button is clicked.
   * 
   * @method
   * @name followAction
   */
  click() {
    return this.followAction();
  },
});
