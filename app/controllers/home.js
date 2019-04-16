import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { oneWay } from '@ember/object/computed';

export default Controller.extend({
  session: service(),
  queryParams: ['tag', 'page'],
  tag: null,
  page: 1,

  isAuthenticated: oneWay('session.isAuthenticated'),
  totalPages: oneWay('model.articles.meta.articlesCount'),
  postsPerPage: oneWay('model.perPage'),

  actions: {
    setTag(value) {
      if (this.tag !== value) {
        this.set('page', 1);
      }
      this.set('tag', value);
    }
  }
});
