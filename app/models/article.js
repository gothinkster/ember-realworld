import DS from 'ember-data';
import { htmlSafe } from '@ember/string';
import { inject as service } from '@ember/service';
import marked from 'marked';
const { attr, belongsTo, hasMany } = DS;

export default DS.Model.extend({
  authorizedFetch: service(),

  /**
   * @property {string} title
   */
  title: attr('string'),

  /**
   * @property {string} slug
   */
  slug: attr('string'),

  /**
   * @property {string} body
   */
  body: attr('string'),

  /**
   * @property {date} createdAt
   */
  createdAt: attr('date', {
    defaultValue() {
      return new Date();
    }
  }),

  /**
   * @property {date} updateAt
   */
  updateAt: attr('date', {
    defaultValue() {
      return new Date();
    }
  }),

  /**
   * @property {hasManyModel} tagList
   */
  tagList: hasMany('tag'),

  /**
   * @property {string} description
   */
  description: attr('string'),

  /**
   * @property {belongsToModel} author
   */
  author: belongsTo('user'),

  /**
   * @property {boolean} favorited
   */
  favorited: attr('boolean'),

  /**
   * @property {number} favoritesCount
   */
  favoritesCount: attr('number'),

  get safeMarkup() {
    const markup = marked(this.body, { sanitize: true });
    return htmlSafe(markup);
  },

  loadComments() {
    return this.store.query('comment', {
      article_id: this.id
    });
  },

  async favorite() {
    await this.favoriteOperation('favorite');
  },

  async unfavorite() {
    await this.favoriteOperation('unfavorite');
  },

  async favoriteOperation(operation) {
    const { article } = await this.authorizedFetch.fetch(
      `/articles/${this.id}/favorite`,
      operation === 'unfavorite' ? 'DELETE' : 'POST'
    );
    this.store.pushPayload({
      articles: [Object.assign(article, { id: article.slug })]
    });
  }
});
