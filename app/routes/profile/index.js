import Route from '@ember/routing/route';

export default class ProfileIndexRoute extends Route {
  async model() {
    let profile = this.modelFor('profile');
    await profile.loadArticles();
    return profile;
  }
}
