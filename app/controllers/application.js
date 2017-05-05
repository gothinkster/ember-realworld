import Ember from 'ember';

const { Controller, computed, inject, get } = Ember;

export default Controller.extend({
  session: inject.service(),
  currentUser: computed.oneWay('session.session.content.authenticated'),
  isAuthenticated: computed.oneWay('session.isAuthenticated'),

  actions: {
    'sign-out'() {
      get(this, 'session').invalidate();
    }
  }
});
