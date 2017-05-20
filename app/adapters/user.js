import ApplicationAdapter from './application';

export default ApplicationAdapter.extend({
  pathForType: function() {
    return 'profiles';
  },

  urlForUpdateRecord(id, modelName /*, snapshot*/) {
    return `/api/${modelName}`;
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
