import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { readOnly } from '@ember/object/computed';

export default Controller.extend({
  session: service(),

  articles: readOnly('model.articles'),

  actions: {
    async favoriteArticle(article) {
      return article.get('favorited') ? article.unfavorite() : article.favorite();
    },
  },
});
