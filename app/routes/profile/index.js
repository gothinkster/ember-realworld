import Ember from 'ember';

export default Ember.Route.extend({
  model(/*params*/) {
    return Ember.RSVP.hash({
      articles: this.store.query('article', { author: this.modelFor('profile').user.get('username') })
    });
  }
});
