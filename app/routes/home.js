import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default Route.extend({
  session: service(),
  queryParams: {
    feed: {
      refreshModel: true,
    },
    tag: {
      refreshModel: true,
    },
    page: {
      refreshModel: true,
    },
  },

  model({ feed, page, tag }) {
    const NUMBER_OF_ARTICLES = 10;
    if (feed === 'your') {
      return this.session.user.fetchFeed(page).then(({ articles, meta }) => {
        meta.pageSize = NUMBER_OF_ARTICLES;
        return { articles, meta };
      });
    } else {
      const offset = (parseInt(page, 10) - 1) * NUMBER_OF_ARTICLES;
      return this.store
        .query('article', {
          limit: NUMBER_OF_ARTICLES,
          feed,
          offset,
          tag,
        })
        .then(articles => {
          articles.meta.pageSize = NUMBER_OF_ARTICLES;
          return { articles, meta: articles.meta };
        });
    }
  },
});
