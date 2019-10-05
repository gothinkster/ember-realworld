import Route from '@ember/routing/route';

export default Route.extend({
  async afterModel(profile) {
    /**
     * Reload the data when visiting the route, otherwise the data remains stale.
     */
    await profile.get('articles').reload();
  },
});
