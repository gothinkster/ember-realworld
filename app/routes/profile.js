import Route from '@ember/routing/route';

export default class ProfileRoute extends Route {
  model({ id }) {
    return this.store.findRecord('profile', id);
  }
}
