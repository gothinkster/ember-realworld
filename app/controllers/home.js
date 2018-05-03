import Controller from '@ember/controller';
import {
  inject as service
} from '@ember/service';
import {
  oneWay
} from '@ember/object/computed';

export default Controller.extend({
  session: service(),
  queryParams: ['tag'],
  tag: null,

  isAuthenticated: oneWay('session.isAuthenticated'),

  actions: {
    setTag(tag) {
      this.set('tag', tag);
    }
  }
});
