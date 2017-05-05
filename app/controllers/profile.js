import Ember from 'ember';

const { Controller, computed, inject } = Ember;

export default Controller.extend({
  session: inject.service(),
  currentUser: computed.oneWay('session.session.content.authenticated'),
  isAuthenticated: computed.oneWay('session.isAuthenticated')
});
