import DS from 'ember-data';
import { inject as service } from '@ember/service';

const { attr, belongsTo, hasMany } = DS;

export default DS.Model.extend({
  session: service(),
  store: service(),
  title: attr('string'),
  body: attr('string'),
  createdAt: attr('date'),
  updatedAt: attr('date'),
  tagList: hasMany('tag'),
  description: attr('string'),
  author: belongsTo('profile', { async: false }),
  favorited: attr('boolean'),
  favoritesCount: attr('number'),
  comments: hasMany('comment', { inverse: 'article' }),

  async favorite() {
    await this.favoriteOperation('favorite');
  },

  async unfavorite() {
    await this.favoriteOperation('unfavorite');
  },

  async favoriteOperation(operation) {
    const payload = await this.session.fetch(
      `/articles/${this.id}/favorite`,
      operation === 'unfavorite' ? 'DELETE' : 'POST',
    );
    const store = this.store;
    const serializer = store.serializerFor('article');
    const primaryModelClass = store.modelFor('article');

    store.push(serializer.normalizeSingleResponse(store, primaryModelClass, payload, this.id));
  },
});
