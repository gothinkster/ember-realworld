import Route from '@ember/routing/route';
import { hash } from 'rsvp';

export default Route.extend({
  queryParams: {
    tag: {
      refreshModel: true,
    },
    page: {
      refreshModel: true,
    },
  },

  model(params) {
    const perPage = 10;
    return hash({
      perPage: perPage,
      articles: this.store.query('article', {
        tag: params.tag,
        limit: 10,
        offset: (params.page - 1) * perPage,
      }),
    });
  },
});
