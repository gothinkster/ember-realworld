import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';

export default class CommentsFormComponent extends Component {
  @service session;

  @tracked
  body = '';

  @action
  async addComment(e) {
    e.preventDefault();
    this.args.addComment(this.body);
    this.body = '';
  }
}
