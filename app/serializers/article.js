import DS from 'ember-data';

export default DS.RESTSerializer.extend(DS.EmbeddedRecordsMixin, {
  primaryKey: 'slug',
  attrs: {
    author: { embedded: 'always' },
    tagList: {
      serialize: 'ids',
      deserialize: 'records',
    },
  },

  normalizeArrayResponse(store, primaryModelClass, payload, id, requestType) {
    payload.articles = payload.articles.map(article => {
      return this.normalizeArticle(article);
    });
    payload.meta = {
      articlesCount: payload.articlesCount,
    };

    delete payload.articlesCount;

    return this._super(store, primaryModelClass, payload, id, requestType);
  },

  normalizeSingleResponse(store, primaryModelClass, payload, id, requestType) {
    payload.article = this.normalizeArticle(payload.article);

    return this._super(store, primaryModelClass, payload, id, requestType);
  },

  /**
   * Normalizses the article data to work with the `article` model.
   * @param {Object} article An article from a payload.
   */
  normalizeArticle(article) {
    article.tagList = article.tagList.map(tag => {
      return {
        value: tag,
      };
    });

    // Add links for relationships that rely on the article slug.
    article.links = {
      comments: 'comments',
    };

    return article;
  },

  serialize() {
    const json = this._super(...arguments);
    const { tagList } = json;
    /**
     * If the tagList is empty, the API requires that the tagList be an array that is not empty
     * so we add an empty string here.
     */
    if (!tagList || !tagList.length) {
      json.tagList = [''];
    }

    return json;
  },
});
