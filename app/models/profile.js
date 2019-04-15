import DS from 'ember-data';
import { inject as service } from '@ember/service';

const { attr, hasMany, Model } = DS;

export default Model.extend({
  session: service(),
  authorizedFetch: service(),

  bio: attr('string'),
  image: attr('string'),
  following: attr('boolean'),

  articles: hasMany('article', { async: false, inverse: 'author' }),

  async loadArticles() {
    const articles = await this.store.query('article', { author: this.id });
    this.articles = articles;
  },

  fetchFavorites() {
    return this.store.query('article', { favorited: this.id });
  },

  async follow() {
    await this.followOperation('follow');
  },

  async unfollow() {
    await this.followOperation('unfollow');
  },

  async followOperation(operation) {
    const { profile } = await this.authorizedFetch.fetch(
      `/profiles/${this.id}/follow`,
      operation === 'follow' ? 'POST' : 'DELETE'
    );
    this.store.pushPayload({
      profiles: [Object.assign(profile, { id: profile.username })]
    });
  }
});
