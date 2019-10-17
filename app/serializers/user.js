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

  /**
   * Add the user ID when serializing the record.
   * @override
   * @param {*} snapshot
   */
  serialize(snapshot) {
    const json = this._super(...arguments);
    const {
      record: { id, password },
    } = snapshot;

    /**
     * Sending an empty string password will cause API to throw an error, so null the password field.
     */
    if (password && !password.trim()) {
      json.password = null;
    }

    /**
     * Include the user ID because it's not automatically included during serialization. The convention is that
     * the ID is included in the URL via adapter.
     */
    json.id = id;

    return json;
  },
});
