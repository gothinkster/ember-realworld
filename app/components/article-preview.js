import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';

export default class ArticlePreviewComponent extends Component {
  @service session;
  @service router;

  @action
  favoriteArticle(article, operation) {
    if (this.session.isLoggedIn) {
      article[operation]();
    } else {
      this.router.transitionTo('login');
    }
  }
}
