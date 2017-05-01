import Ember from 'ember';
import { task } from 'ember-concurrency';
const { computed, inject } = Ember;

export default Ember.Controller.extend({
  session: inject.service(),
  articles: inject.service(),

  isAuthenticated: computed.oneWay('session.isAuthenticated'),

  favorite: task(function*(slug) {
    yield this.get('articles').addFavorite(slug);
  }).drop()
});
