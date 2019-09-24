import DS from 'ember-data';

export default DS.RESTSerializer.extend({
  primaryKey: 'value',

  normalizeArrayResponse(store, primaryModelClass, payload, id, requestType) {
    const newPayload = {
      tags: payload.tags.map(tag => {
        return {
          value: tag,
        };
      }),
    };

    return this._super(store, primaryModelClass, newPayload, id, requestType);
  },
});
