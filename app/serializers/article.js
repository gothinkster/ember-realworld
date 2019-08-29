import DS from 'ember-data';

export default DS.RESTSerializer.extend(DS.EmbeddedRecordsMixin, {
  primaryKey: 'slug',
  attrs: {
    author: { embedded: 'always' },
    tagList: { embedded: 'always' },
  },

  normalizeArrayResponse(store, primaryModelClass, payload, id, requestType) {
    payload.articles = payload.articles.map(article => {
      return this.normalizeArticle(store, article, article.slug);
    });
    payload.meta = {
      articlesCount: payload.articlesCount,
    };

    delete payload.articlesCount;

    return this._super(store, primaryModelClass, payload, id, requestType);
  },

  normalizeSingleResponse(store, primaryModelClass, payload, id, requestType) {
    payload.article = this.normalizeArticle(store, payload.article, id);

    return this._super(store, primaryModelClass, payload, id, requestType);
  },

  normalizeArticle(store, article) {
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
});
