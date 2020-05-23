import RESTSerializer, { EmbeddedRecordsMixin } from '@ember-data/serializer/rest';

export default class ArticleSerializer extends RESTSerializer.extend(EmbeddedRecordsMixin) {
  primaryKey = 'slug';

  attrs = {
    author: { embedded: 'always' },
  };

  extractMeta(store, typeClass, payload) {
    if (payload && payload.articlesCount) {
      let meta = { articlesCount: payload.articlesCount };
      delete payload.articlesCount;
      return meta;
    }
  }
}
