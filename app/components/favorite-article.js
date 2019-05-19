import Component from '@ember/component';
import { inject as service } from '@ember/service';

export default Component.extend({
  session: service(),
  router: service(),
  tagName: 'button',
  classNames: ['btn btn-sm'],
  classNameBindings: ['article.favorited:btn-outline-primary:btn-primary'],
  'data-test-favorite-article-button': true,
  async click() {
    const operation = this.article.favorited ? 'unfavorite' : 'favorite';
    if (this.session.isLoggedIn) {
      await this.article[operation]();
    } else {
      this.router.transitionTo('sign-in');
    }
  },
});
