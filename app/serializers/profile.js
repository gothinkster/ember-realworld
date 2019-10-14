import DS from 'ember-data';

export default DS.RESTSerializer.extend({
  primaryKey: 'username',
  normalizeFindRecordResponse(store, primaryModelClass, payload) {
    const { profile } = payload;
    const { username } = profile;
    const articleAdapter = store.adapterFor('article');
    const articlesURL = articleAdapter.buildURL('article');

    /**
     * `links` define the relationship URLs.
     * Using the corresponding adapter, such as `article` adapter` to generate a base URL.
     * The base URL should be an absolute URL. Relative URLs will be appended to a URL built by the `profile` adapter,
     * which isn't structured the way request for articles needs to be.
     */
    profile.links = {
      articles: `${articlesURL}?author=${username}`,
      favoriteArticles: `${articlesURL}?favorited=${username}`,
    };

    return this._super(...arguments);
  },
});
