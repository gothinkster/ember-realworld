import DS from 'ember-data';

export default DS.RESTSerializer.extend(DS.EmbeddedRecordsMixin, {
  primaryKey: 'slug',

  attrs: {
    author: { embedded: 'always' }
  },

  extractMeta(store, typeClass, payload) {
    if (payload && payload.articlesCount) {
      const meta = { articlesCount: payload.articlesCount };
      delete payload.articlesCount;
      return meta;
    }
  }
});
