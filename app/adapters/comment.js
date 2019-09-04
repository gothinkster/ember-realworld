import ApplicationAdapter from './application';

export default ApplicationAdapter.extend({
  pathForType() {
    return 'articles';
  },

  buildURL(modelName, id, snapshot) {
    let url = `${this._super(modelName, snapshot.record.get('article.id'), snapshot)}/comments`;

    if (id) {
      url += `/${id}`;
    }

    return url;
  },
});
