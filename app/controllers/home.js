import Ember from 'ember';
const { computed, inject } = Ember;

export default Ember.Controller.extend({
  session: inject.service(),
  articles: inject.service(),

  isAuthenticated: computed.oneWay('session.isAuthenticated'),

  actions: {
    favorite(slug) {
      this.get('articles').addFavorite(slug);
    }
  }
});
