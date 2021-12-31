import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { task } from 'ember-concurrency-decorators';
import { inject as service } from '@ember/service';

const NUMBER_OF_ARTICLES_PER_PAGE = 10;

export default class ArticleListComponent extends Component {
  @service session;
  @service store;
  @service router;
  @tracked articles = [];

  constructor() {
    super(...arguments);
    this.loadArticles.perform();
  }

  @task({ restartable: true })
  *loadArticles() {
    let offset = (parseInt(this.args.page, 10) - 1) * NUMBER_OF_ARTICLES_PER_PAGE;
    if (this.args.feed === 'your') {
      if (this.session.isLoggedIn) {
        this.articles = yield this.session.user.fetchFeed(this.args.page);
      } else {
        this.router.transitionTo('index', { queryParams: { feed: null } });
      }
    } else {
      this.articles = yield this.store.query('article', {
        limit: NUMBER_OF_ARTICLES_PER_PAGE,
        offset: offset,
        tag: this.args.tag || undefined,
      });
    }
  }

  get showPagination() {
    return this.articles && this.articles.length > NUMBER_OF_ARTICLES_PER_PAGE;
  }
}
