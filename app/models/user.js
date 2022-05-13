import Model, { attr } from '@ember-data/model';
import { service } from '@ember/service';

export default class UserModel extends Model {
  @service session;
  @service store;

  @attr bio;
  @attr email;
  @attr image;
  @attr password;
  @attr token;
  @attr username;
  @attr('date') createdAt;
  @attr('date') updatedAt;

  async fetchFeed(page = 1) {
    let { articles } = await this.session.fetch(`/articles/feed?page=${page}`);
    if (!articles.length) {
      return [];
    }
    let ids = articles.map((article) => article.slug);
    let normalizedArticles = articles.map((article) =>
      Object.assign({}, article, { id: article.slug }),
    );
    this.store.pushPayload({ articles: normalizedArticles });
    return this.store.peekAll('article').filter((article) => ids.includes(article.id));
  }
}
