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
    return Ember.RSVP.hash({
      popularTags: this.store.findAll('tag'),
      articles: this.store.query('article', {
        tag: params.tag,
        limit: 10,
        offset: (params.page - 1) * 10
      })
    });
  }
});
