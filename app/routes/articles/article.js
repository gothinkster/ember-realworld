import Route from '@ember/routing/route';

export default class ArticlesArticleRoute extends Route {
  model({ id }) {
    return this.store.findRecord('article', id);
  }
}
