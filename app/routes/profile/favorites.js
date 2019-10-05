import Route from '@ember/routing/route';

export default Route.extend({
  templateName: 'profile/index',
  async afterModel(profile) {
    /**
     * Reload the data when visiting the route, otherwise the data remains stale.
     */
    await profile.get('favoriteArticles').reload();
  },
});
