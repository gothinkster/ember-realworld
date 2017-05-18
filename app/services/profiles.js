import Ember from 'ember';
const { inject } = Ember;

export default Ember.Service.extend({
  store: inject.service(),

  followUser(userName) {
    const adapter = this.get('store').adapterFor('user');
    return adapter.followUser(userName);
  },
  unFollowUser(userName) {
    const adapter = this.get('store').adapterFor('user');
    return adapter.unFollowUser(userName);
  }
});
