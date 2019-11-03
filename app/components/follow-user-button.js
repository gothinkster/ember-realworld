import Component from '@ember/component';

export default Component.extend({
  tagName: ['button'],
  classNameBindings: ['following:btn-secondary:btn-outline-secondary'],
  attributeBindings: ['disabled'],
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
