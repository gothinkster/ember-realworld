import Ember from 'ember';

export default Ember.Route.extend({
  model(/*params*/) {
    return Ember.RSVP.hash({
      articles: this.store.query('article', { favorited: this.modelFor('profile').user.get('username') })
    });
  },
  templateName: 'profile/index'
});
