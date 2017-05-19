import DS from 'ember-data';

const { attr } = DS;

export default DS.Model.extend({
  /**
   * @property {string} username
   */
  username: attr('string'),

  /**
   * @property {string} email
   */
  email: attr('string'),

  /**
   * @property {string} bio
   */
  bio: attr('string'),

  /**
   * @property {string} image
   */
  image: attr('string'),

  /**
   * @property {boolean} following
   */
  following: attr('boolean'),

  // Only needed for authenticating users
  password: attr('string'),
  token: attr('string')
});
