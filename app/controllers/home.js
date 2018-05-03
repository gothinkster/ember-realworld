import Controller from '@ember/controller';
import {
  inject as service
} from '@ember/service';
import {
  oneWay
} from '@ember/object/computed';

export default Controller.extend({
  session: service(),
  queryParams: ['tag', 'page'],
  tag: null,
  page: 1,
  totalPages: 500,
  pageArray: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],

  isAuthenticated: oneWay('session.isAuthenticated'),

  actions: {
    setTag(tag) {
      this.set('tag', tag);
      this.set('page', 1);
    },
    setPage(page) {
      this.set('page', page);
    }
  }
});
