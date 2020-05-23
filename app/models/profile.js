import Model, { attr, hasMany } from '@ember-data/model';
import { inject as service } from '@ember/service';

export default class UserModel extends Model {
  @service session;

  @attr bio;
  @attr image;
  @attr following;

  @hasMany('article', { async: false, inverse: 'author' }) articles;

  async loadArticles() {
    let articles = await this.store.query('article', { author: this.id });
    this.articles = articles;
  }

  fetchFavorites() {
    return this.store.query('article', { favorited: this.id });
  }

  async follow() {
    await this.followOperation('follow');
  }

  async unfollow() {
    await this.followOperation('unfollow');
  }

  async followOperation(operation) {
    let { profile } = await this.session.fetch(
      `/profiles/${this.id}/follow`,
      operation === 'follow' ? 'POST' : 'DELETE',
    );
    this.store.pushPayload({
      profiles: [Object.assign(profile, { id: profile.username })],
    });
  }
}
