import Ember from 'ember';
import { task } from 'ember-concurrency';

const { Controller, computed, inject } = Ember;

export default Controller.extend({
  profiles: inject.service(),
  session: inject.service(),

  currentUser: computed.oneWay('session.session.content.authenticated'),
  isAuthenticated: computed.oneWay('session.isAuthenticated'),

  waitingForFollowing: false,

  followUser: task(function*(userName) {
    this.toggleProperty('waitingForFollowing');

    let result = yield this.get('profiles').followUser(userName);
    let isFollowing = result.profile.following;
    this.set('model.user.following', isFollowing);

    this.toggleProperty('waitingForFollowing');
  }).drop(),
  unFollowUser: task(function*(userName) {
    this.toggleProperty('waitingForFollowing');

    let result = yield this.get('profiles').unFollowUser(userName);
    let isFollowing = result.profile.following;
    this.set('model.user.following', isFollowing);

    this.toggleProperty('waitingForFollowing');
  }).drop()
});
