import IndexController from './index';
import { readOnly } from '@ember/object/computed';

export default IndexController.extend({
  /**
   * Filter favorite articles for those that are marked as favorite because the API will return an array
   * but unfavoriting an article does not remove it from the list.
   */
  articles: readOnly('model.favoriteArticles'),
});
