import DS from 'ember-data';

const { attr, belongsTo, hasMany } = DS;

export default DS.Model.extend({
  /**
   * @property {string} title
   */
  title: attr('string'),

  /**
   * @property {string} slug
   */
  slug: attr('string'),

  /**
   * @property {string} body
   */
  body: attr('string'),

  /**
   * @property {date} createdAt
   */
  createdAt: attr('date', {
    defaultValue() {
      return new Date();
    },
  }),

  /**
   * @property {date} updateAt
   */
  updateAt: attr('date', {
    defaultValue() {
      return new Date();
    },
  }),

  /**
   * @property {hasManyModel} tagList
   */
  tagList: hasMany('tag'),

  /**
   * @property {string} description
   */
  description: attr('string'),

  /**
   * @property {belongsToModel} author
   */
  author: belongsTo('profile'),

  /**
   * @property {boolean} favorited
   */
  favorited: attr('boolean'),

  /**
   * @property {number} favoritesCount
   */
  favoritesCount: attr('number'),
});
