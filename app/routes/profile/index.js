import Route from '@ember/routing/route';

export default Route.extend({
  model() {
    const profile = this.modelFor('profile');
    return profile.loadArticles().then(() => profile);
  },
});
