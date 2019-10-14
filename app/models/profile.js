import DS from 'ember-data';
import { inject as service } from '@ember/service';

export default DS.Model.extend({
  session: service(),
  store: service(),
  bio: DS.attr('string'),
  image: DS.attr('string'),
  following: DS.attr('boolean'),
  /**
   * Articles by the profile owner.
   * Inverse option is `null` to prevent a profile from being set on the article incorrectly when a `hasMany` relationship loads articles not owned
   * by the profile, such as `favoriteArticles`.
   */
  articles: DS.hasMany('article', { inverse: null }),
  /**
   * Articles favorited by the profile owner.
   * Inverse option is `null` to prevent a profile from being set on the article incorrectly when a `hasMany` relationship loads articles not owned
   * by the profile, such as `favoriteArticles`.
   */
  favoriteArticles: DS.hasMany('article', { inverse: null }),
  username: DS.attr('string'),

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
