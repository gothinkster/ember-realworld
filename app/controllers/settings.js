import Ember from 'ember';

const { Controller, get, inject, computed } = Ember;

export default Controller.extend({
  session: inject.service(),
  currentUser: computed.oneWay('session.session.content.authenticated'),
  isAuthenticated: computed.oneWay('session.isAuthenticated'),

  usernameTmp: computed.oneWay('currentUser.username'),
  imageTmp: computed.oneWay('currentUser.image'),
  bioTmp: computed.oneWay('currentUser.bio'),
  emailTmp: computed.oneWay('currentUser.email'),
  passwordTmp: '',

  actions: {
    signOut() {
      get(this, 'session').invalidate();
    }
  }
});
