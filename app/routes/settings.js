import Ember from 'ember';
import AuthenticatedRoute from 'ember-simple-auth/mixins/authenticated-route-mixin';

const { Route, get } = Ember;

export default Route.extend(AuthenticatedRoute, {
  actions: {
    updateSettings(currentUsername) {
      let currentUser = this.store.findRecord('user', currentUsername);
      let userTmp = {
        username: get(this, 'usernameTmp'),
        image: get(this, 'imageTmp'),
        bio: get(this, 'bioTmp'),
        email: get(this, 'emailTmp'),
        passwordTmp: get(this, 'usernameTmp')
      };
      let userNameChanged = !Ember.isEqual(userTmp.username, currentUser.username);
      let imageChanged = !Ember.isEqual(userTmp.image, currentUser.image);
      let bioChanged = !Ember.isEqual(userTmp.bio, currentUser.bio);
      let emailChanged = !Ember.isEqual(userTmp.email, currentUser.email);
      let passwordChanged = userTmp.password && userTmp.password.length > 0;
      if (userNameChanged || imageChanged || bioChanged || emailChanged || passwordChanged) {
        currentUser.set('username', userTmp.username);
        currentUser.set('image', userTmp.image);
        currentUser.set('bio', userTmp.bio);
        currentUser.set('email', userTmp.email);
        currentUser.set('password', userTmp.password);
      }
    }
  }
});
