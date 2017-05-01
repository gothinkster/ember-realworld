import Ember from 'ember';
const { inject } = Ember;

export default Ember.Service.extend({
  store: inject.service(),

  addFavorite(slug) {
    const adapter = this.get('store').adapterFor('article');
    adapter.addFavorite(slug);
  }
});
