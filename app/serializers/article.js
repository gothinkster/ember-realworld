import DS from 'ember-data';

export default DS.RESTSerializer.extend(DS.EmbeddedRecordsMixin, {
  primaryKey: 'slug',
  attrs: {
    author: { embedded: 'always' },
    tagList: { embedded: 'always' }
  },
  normalizeResponse(store, primaryModelClass, payload, id, requestType) {
    const newPayload = payload;
    newPayload.articles = newPayload.articles.map(article => {
      const newArticle = article;
      newArticle.tagList = article.tagList.map(tag => {
        return {
          value: tag
        };
      });
      return newArticle;
    });
    newPayload.meta = {
      articlesCount: payload.articlesCount
    };

    return this._super(store, primaryModelClass, newPayload, id, requestType);
  }
});
