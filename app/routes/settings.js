import Ember from 'ember';
import AuthenticatedRoute from 'ember-simple-auth/mixins/authenticated-route-mixin';

const { Route, get, set, inject, computed } = Ember;

export default Route.extend(AuthenticatedRoute, {
  session: inject.service(),
  currentUser: computed.oneWay('session.session.content.authenticated'),

  model() {
    return this.store.findRecord('user', get(this, 'currentUser').username);
  },

  actions: {
    updateSettings(user) {
      if (get(user, 'hasDirtyAttributes')) {
        user.save().then(data => {
          console.log(get(this, 'currentUser'));
          set(this, 'session.session.content.authenticated.image', data.image);
          console.log(get(this, 'currentUser'));
        });
      }
    }
  }
});
