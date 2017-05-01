import ApplicationAdapter from './application';

export default ApplicationAdapter.extend({
  addFavorite(slug) {
    const url = this.buildURL('articles', slug) + '/favorite';
    return this.ajax(url, 'POST');
  }
});
