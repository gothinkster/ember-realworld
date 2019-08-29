import ApplicationAdapter from './application';

export default ApplicationAdapter.extend({
  pathForType() {
    return 'articles';
  },

  urlForCreateRecord(modelName, snapshot) {
    const articleID = snapshot.record.get('article.id');
    return `${this.buildURL(modelName, articleID)}/comments`;
  },

  urlForUpdateRecord(id, modelName, snapshot) {
    const articleID = snapshot.record.get('article.id');
    return `${this._super(articleID, modelName, snapshot)}/comments/${id}`;
  },

  urlForDeleteRecord(id, modelName, snapshot) {
    const articleID = snapshot.record.get('article.id');
    return `${this._super(articleID, modelName, snapshot)}/comments/${id}`;
  },
});
