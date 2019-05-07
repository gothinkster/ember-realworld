import DS from 'ember-data';

export default DS.RESTSerializer.extend({
  primaryKey: 'username',
  normalizeFindRecordResponse(store, primaryModelClass, payload) {
    payload.profiles = payload.profile;
    delete payload.profile;
    return this._super(...arguments);
  },
});
