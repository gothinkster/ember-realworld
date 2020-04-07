import Model, { attr, belongsTo, hasMany } from '@ember-data/model';
import marked from 'marked';
import { htmlSafe } from '@ember/string';
import { inject as service } from '@ember/service';

export default class ArticleModel extends Model {
  @service session;

  @attr title;
  @attr description;
  @attr body;
  @attr('date') createdAt;
  @attr('date') updatedAt;
  @attr favorited;
  @attr favoritesCount;
  @attr({ defaultValue: () => [] }) tagList;

  @belongsTo('profile') author;
  @hasMany('comment', { async: false }) comments;

  get safeMarkup() {
    let markup = marked(this.body, { sanitize: true });
    return htmlSafe(markup);
  }

  loadComments() {
    return this.store.query('comment', {
      article_id: this.id,
    });
  }

  async favorite() {
    await this.favoriteOperation('favorite');
  }

  async unfavorite() {
    await this.favoriteOperation('unfavorite');
  }

  async favoriteOperation(operation) {
    let { article } = await this.session.fetch(
      `/articles/${this.id}/favorite`,
      operation === 'unfavorite' ? 'DELETE' : 'POST',
    );
    this.store.pushPayload({
      articles: [Object.assign(article, { id: article.slug })],
    });
  }
}
