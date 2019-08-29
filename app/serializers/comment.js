import DS from 'ember-data';

export default DS.RESTSerializer.extend(DS.EmbeddedRecordsMixin, {
  attrs: {
    author: { embedded: 'always' },
  },
  // normalizeArrayResponse(store, primaryModelClass, payload, id, requestType) {
  //   const newPayload = payload;

  //   debugger;

  //   return this._super(store, primaryModelClass, newPayload, id, requestType);
  // },
});
