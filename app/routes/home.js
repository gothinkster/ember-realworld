import Route from '@ember/routing/route';
import {
  hash
} from 'rsvp';

export default Ember.Route.extend({
  queryParams: {
    tag: {
      refreshModel: true
    },
    page: {
      refreshModel: true
    }
  },

  model(params) {
    let perPage = 10;
    return Ember.RSVP.hash({
      perPage: perPage,
      popularTags: this.store.findAll('tag'),
      articles: this.store.query('article', {
        tag: params.tag,
        limit: 10,
        offset: (params.page - 1) * perPage
      })
    });
  },

  setupController(controller, model) {
    this._super(controller, model);
    controller.set('totalPages', model.articles.get('meta').articlesCount);
    controller.set('postsPerPage', model.perPage);
  }
});
