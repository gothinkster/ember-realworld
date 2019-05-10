import Route from '@ember/routing/route';

export default Route.extend({
  queryParams: {
    tag: {
      refreshModel: true,
    },
    page: {
      refreshModel: true,
    },
  },

  model({ page, tag }) {
    const NUMBER_OF_ARTICLES = 10;
    const offset = (parseInt(page, 10) - 1) * NUMBER_OF_ARTICLES;
    return this.store
      .query('article', {
        limit: NUMBER_OF_ARTICLES,
        offset,
        tag,
      })
      .then(articles => {
        articles.meta.pageSize = NUMBER_OF_ARTICLES;
        return articles;
      });
  },
});
