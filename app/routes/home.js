import Ember from 'ember';

export default Ember.Route.extend({
  model() {
    return Ember.RSVP.hash({
      popularTags: this.store.findAll('tag'),
      articles: this.store.findAll('article')
    });
  }
});
