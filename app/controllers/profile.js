import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { task } from 'ember-concurrency';

export default Controller.extend({
  profiles: service(),
  session: service(),

  waitingForFollowing: false,

  followUser: task(function*(userName) {
    this.toggleProperty('waitingForFollowing');

    const result = yield this.profiles.followUser(userName);
    const isFollowing = result.profile.following;
    this.set('model.user.following', isFollowing);

    this.toggleProperty('waitingForFollowing');
  }).drop(),

  unFollowUser: task(function*(userName) {
    this.toggleProperty('waitingForFollowing');

    const result = yield this.profiles.unFollowUser(userName);
    const isFollowing = result.profile.following;
    this.set('model.user.following', isFollowing);

    this.toggleProperty('waitingForFollowing');
  }).drop(),
});
