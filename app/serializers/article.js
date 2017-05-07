import DS from 'ember-data';

export default DS.RESTSerializer.extend(DS.EmbeddedRecordsMixin, {
  primaryKey: 'slug',

  attrs: {
    author: { embedded: 'always' },
    tagList: { embedded: 'always' }
  },

  extractAttributes(modelClass, resourceHash) {
    resourceHash.tagList = resourceHash.tagList.map(tag => {
      return {
        value: tag
      };
    });

    return this._super(modelClass, resourceHash);
  }
});
