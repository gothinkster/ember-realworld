import Controller from '@ember/controller';
import {
  inject as service
} from '@ember/service';
import {
  oneWay
} from '@ember/object/computed';

export default Controller.extend({
  session: service(),

  isAuthenticated: oneWay('session.isAuthenticated'),
  activeTag: null,

  actions: {
    setTag(tag) {
      this.set('activeTag', tag);
    }
  }
});
