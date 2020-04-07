import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

export default class CommentsSectionComponent extends Component {
  @tracked isLoading = false;

  @service store;
  @service session;

  constructor() {
    super(...arguments);
    this.loadComments();
  }

  async loadComments() {
    this.isLoading = true;
    let comments = await this.args.article.loadComments();
    this.args.article.set('comments', comments);
    this.isLoading = false;
  }

  @action
  async addComment(body) {
    try {
      await this.store.createRecord('comment', { article: this.args.article, body }).save();
    } catch {
      // Capture comment save error
    }
  }
}
