import Component from '@ember/component';

export default Component.extend({
  tagName: 'button',
  classNames: ['btn', 'btn-sm'],
  'data-test-favorite-article-button': true,

  /**
   * Method executed when "favorite article" button is clicked.
   * @method
   * @name onClick
   */

  click() {
    return this.onClick();
  },
});
