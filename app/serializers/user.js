import DS from 'ember-data';

export default DS.RESTSerializer.extend({
  attrs: {
    token: {
      serialize: false,
    },
    createdAt: {
      serialize: false,
    },
    updatedAt: {
      serialize: false,
    },
  },
});
