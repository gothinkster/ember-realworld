import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { task } from 'ember-concurrency';

export default Controller.extend({
  session: service(),

  waitingForFollowing: false,

  followUser: task(function*(profile) {
    this.toggleProperty('waitingForFollowing');

    try {
      yield profile.follow();
    } finally {
      this.toggleProperty('waitingForFollowing');
    }
  }).drop(),

  unFollowUser: task(function*(profile) {
    this.toggleProperty('waitingForFollowing');

    try {
      yield profile.unfollow();
    } finally {
      this.toggleProperty('waitingForFollowing');
    }
  }).drop(),
});
