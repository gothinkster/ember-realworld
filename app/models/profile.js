import DS from 'ember-data';

export default DS.Model.extend({
  bio: DS.attr('string'),
  image: DS.attr('string'),
  following: DS.attr('boolean'),
  articles: DS.hasMany('article', { async: false, inverse: 'author' }),
  loadArticles() {
    return this.store.query('article', { author: this.id }).then(articles => {
      this.set('articles', articles);
      return articles;
    });
  },
});
