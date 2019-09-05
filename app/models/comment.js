import DS from 'ember-data';
const { Model, attr, belongsTo } = DS;

export default Model.extend({
  createdAt: attr(),
  updatedAt: attr(),
  body: attr(),
  author: belongsTo('profile', { async: false }),
  article: belongsTo('article', { async: false }),
});
