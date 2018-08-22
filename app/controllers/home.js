import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { oneWay } from '@ember/object/computed';

export default Controller.extend({
  session: service(),
  queryParams: ['tag', 'page'],
  tag: null,
  page: 1,
  totalPages: 1,

  isAuthenticated: oneWay('session.isAuthenticated'),

  actions: {
    setVariable(variable, value) {
      if (this.get(variable) !== value && variable === 'tag') this.set('page', 1);
      this.set(variable, value);
    }
  }
});
