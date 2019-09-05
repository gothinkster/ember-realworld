import DS from 'ember-data';
import { inject as service } from '@ember/service';

export default DS.Model.extend({
  session: service(),
  store: service(),
  bio: DS.attr('string'),
  image: DS.attr('string'),
  following: DS.attr('boolean'),
  articles: DS.hasMany('article', { async: false, inverse: 'author' }),
  username: DS.attr('string'),

  loadArticles() {
    return this.store.query('article', { author: this.id }).then(articles => {
      this.set('articles', articles);
      return articles;
    });
  },

  async follow() {
    await this.followOperation('follow');
  },

  async unfollow() {
    await this.followOperation('unfollow');
  },

  async followOperation(operation) {
    const { profile } = await this.session.fetch(
      `/profiles/${this.username}/follow`,
      operation === 'unfollow' ? 'DELETE' : 'POST',
    );
    this.store.pushPayload({
      profiles: [Object.assign(profile, { id: profile.username })],
    });
  },
});
