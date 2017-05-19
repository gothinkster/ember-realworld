import ApplicationAdapter from './application';

export default ApplicationAdapter.extend({
  pathForType: function() {
    return 'profiles';
  },
  followUser(userName) {
    const url = this.buildURL('user', userName) + '/follow';
    return this.ajax(url, 'POST');
  },
  unFollowUser(userName) {
    const url = this.buildURL('user', userName) + '/follow';
    return this.ajax(url, 'DELETE');
  }
});
