import ApplicationAdapter from './application';

export default ApplicationAdapter.extend({
  /**
   * Returns the model name as it is, so we can pass in plural and singular versions of the name.
   * @override
   * @param {String} modelName Name of model.
   */
  pathForType(modelName) {
    return modelName;
  },

  /**
   * URL for updating a user record uses a singular form of the model name and does not include the record ID. E.g. `/user` instead of `/users/<id>`
   * @override
   * @param {String} id ID of the record to be updated.
   * @param {String} modelName Name of the model class that the record is an instance of.
   * @param {Object} snapshot
   */
  urlForUpdateRecord(id, modelName, snapshot) {
    return this._super(null, 'user', snapshot);
  },

  followUser(userName) {
    const url = this.buildURL('user', userName) + '/follow';
    return this.ajax(url, 'POST');
  },
  unFollowUser(userName) {
    const url = this.buildURL('user', userName) + '/follow';
    return this.ajax(url, 'DELETE');
  },
});
