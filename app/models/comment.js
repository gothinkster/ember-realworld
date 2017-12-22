import DS from 'ember-data';

const { attr, belongsTo } = DS;

export default DS.Model.extend({
  /**
   * @property {string} body
   */
  body: attr(),

  /**
   * @property {date} createdAt
   */
  createdAt: attr('date', {
    defaultValue() {
      return new Date();
    }
  }),

  /**
   * @property {date} updateAt
   */
  updateAt: attr('date', {
    defaultValue() {
      return new Date();
    }
  }),

  /**
   * @property {belongsToModel} author
   */
  author: belongsTo('user')
});
