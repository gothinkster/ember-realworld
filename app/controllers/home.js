import Controller from '@ember/controller';
import { oneWay } from '@ember/object/computed';

export default Controller.extend({
  queryParams: ['tag', 'page'],
  tag: null,
  page: 1,

  totalPages: oneWay('model.articles.meta.articlesCount'),
  postsPerPage: oneWay('model.perPage'),
});
