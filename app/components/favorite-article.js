import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';

export default class FavoriteArticleComponent extends Component {
  @service session;
  @service router;

  @action
  favoriteArticle(operation) {
    if (this.session.isLoggedIn) {
      this.args.article[operation]();
    } else {
      this.router.transitionTo('login');
    }
  }
}
