import Component from '@ember/component';

export default Component.extend({
  tagName: 'button',
  classNames: ['btn', 'btn-sm'],
  classNameBindings: ['following:btn-secondary:btn-outline-secondary'],
  attributeBindings: ['disabled'],
  'data-test-follow-author-button': true,

  /**
   * Method executed when "follow user" button is clicked.
   *
   * @method
   * @name onClick
   */
  click() {
    return this.onClick();
  },
});
