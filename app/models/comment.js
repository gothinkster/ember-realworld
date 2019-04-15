import DS from 'ember-data';
const { Model, attr, belongsTo } = DS;

export default Model.extend({
  body: attr('string'),
  createdAt: attr('date'),
  updatedAt: attr('date'),

  author: belongsTo('profile'),
  article: belongsTo('article')
});
