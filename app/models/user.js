import DS from 'ember-data';

export default DS.Model.extend({
  username: DS.attr('string'),
  email: DS.attr('string'),
  bio: DS.attr('string'),
  image: DS.attr('string'),
  following: DS.attr('boolean'),
  password: DS.attr('string'),
  token: DS.attr('string'),
  createdAt: DS.attr('string'),
  updatedAt: DS.attr('string'),
});
