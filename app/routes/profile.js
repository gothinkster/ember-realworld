import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default class ProfileRoute extends Route {
  @service store;

  model({ id }) {
    return this.store.findRecord('profile', id);
  }
}
