import Ember from 'ember';

const { Controller, get, inject, computed } = Ember;

export default Controller.extend({
  session: inject.service(),
  isAuthenticated: computed.oneWay('session.isAuthenticated'),

  actions: {
    signOut() {
      get(this, 'session').invalidate();
    }
  }
});
