import Route from '@ember/routing/route';

export default class ProfileFavoritesRoute extends Route {
  async model() {
    let profile = this.modelFor('profile');
    return profile.fetchFavorites();
  }

  setupController(controller, model) {
    super.setupController(controller, model);
    controller.set('profile', this.modelFor('profile'));
  }
}
