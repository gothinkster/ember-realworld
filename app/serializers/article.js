import DS from 'ember-data';

export default DS.RESTSerializer.extend(DS.EmbeddedRecordsMixin, {
  primaryKey: 'slug',
  attrs: {
    author: { embedded: 'always' },
    tagList: { embedded: 'always' }
  },
  normalizeResponse(store, primaryModelClass, payload, id, requestType) {
    let newPayload = {};
    newPayload.articles = payload.articles.map(article => {
      let newArticle = article;
      newArticle.tagList = article.tagList.map(tag => {
        return {
          value: tag
        };
      });
      return newArticle;
    });
    newPayload.meta = { total: payload.articlesCount };
    return this._super(store, primaryModelClass, newPayload, id, requestType);
  }
});
