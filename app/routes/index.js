import Route from '@ember/routing/route';

export default class IndexRoute extends Route {
  queryParams = {
    feed: {
      refreshModel: true,
    },
    page: {
      refreshModel: true,
    },
    tag: {
      refreshModel: true,
    },
  };
}
