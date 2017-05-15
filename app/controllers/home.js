import Ember from 'ember';
const { computed, inject } = Ember;

export default Ember.Controller.extend({
  session: inject.service(),

  isAuthenticated: computed.oneWay('session.isAuthenticated')
});
