import Ember from 'ember';

export default Ember.Route.extend({
  model(params) {
    return Ember.RSVP.hash({
      user: this.store.find('user', params.username),
      articles: this.store.query('article', { author: params.username })
    });
  }
});
