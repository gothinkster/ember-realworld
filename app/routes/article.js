import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default Route.extend({
  store: service(),

  model({ slug }) {
    return this.store.findRecord('article', slug);
  },

  actions: {
    async createComment(article, message, event) {
      event.preventDefault();

      await this.store
        .createRecord('comment', {
          article,
          body: message,
        })
        .save();

      // Clear the `newComment` since the new comment has been created.
      this.controller.set('newComment', '');
    },

    async deleteComment(comment) {
      return comment.destroyRecord();
    },

    async favoriteArticle(article) {
      return article.get('favorited') ? article.unfavorite() : article.favorite();
    },

    async followAuthor(author) {
      return author.get('following') ? author.unfollow() : author.follow();
    },
  },
});
