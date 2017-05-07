import Ember from 'ember';
import UnauthenticatedRoute from 'ember-simple-auth/mixins/unauthenticated-route-mixin';

export default Ember.Route.extend(UnauthenticatedRoute, {
  model(params) {
    return this.store.findRecord('article', params.slug);
  }
});
