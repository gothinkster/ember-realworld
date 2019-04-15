import DS from 'ember-data';
import { inject as service } from '@ember/service';

const { attr } = DS;

export default DS.Model.extend({
  authorizedFetch: service(),

  /**
   * @property {string} username
   */
  username: attr('string'),

  /**
   * @property {string} email
   */
  email: attr('string'),

  /**
   * @property {string} bio
   */
  bio: attr('string'),

  /**
   * @property {string} image
   */
  image: attr('string'),

  /**
   * @property {boolean} following
   */
  following: attr('boolean'),

  // Only needed for authenticating users
  password: attr('string'),
  token: attr('string'),

  async fetchFeed(page = 1) {
    const { articles } = await this.authorizedFetch.fetch(`/articles/feed?page=${page}`);
    if (!articles.length) {
      return [];
    }
    const ids = articles.map(article => article.id);
    this.store.pushPayload({
      articles: [articles]
    });
    return this.store.peekAll('article').filter(article => ids.includes(article.id));
  }
});
