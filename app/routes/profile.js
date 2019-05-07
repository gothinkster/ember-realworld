import Route from '@ember/routing/route';
import { hash } from 'rsvp';

export default Route.extend({
  model(params) {
    return hash({
      user: this.store.findRecord('user', params.username),
    });
  },
});
