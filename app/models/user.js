import DS from 'ember-data';
import { inject as service } from '@ember/service';

export default DS.Model.extend({
  session: service(),
  username: DS.attr('string'),
  email: DS.attr('string'),
  bio: DS.attr('string'),
  image: DS.attr('string'),
  following: DS.attr('boolean'),
  password: DS.attr('string'),
  token: DS.attr('string'),
  createdAt: DS.attr('string'),
  updatedAt: DS.attr('string'),

  async fetchFeed(page = 1) {
    const { articles, articlesCount } = await this.session.fetch(`/articles/feed?page=${page}`);
    if (!articles.length) {
      return [];
    }
    const ids = articles.map(article => article.slug);
    const normalizedArticles = articles.map(article =>
      Object.assign({}, article, {
        id: article.slug,
        tagList: article.tagList.map(tag => ({ value: tag })),
      }),
    );
    this.store.pushPayload({ articles: normalizedArticles });
    return {
      articles: this.store.peekAll('article').filter(article => ids.includes(article.id)),
      meta: { articlesCount },
    };
  },
});
