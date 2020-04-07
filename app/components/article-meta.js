import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';

export default class SignUpComponent extends Component {
  @service session;
  @service router;

  @action
  async deleteArticle() {
    await this.args.article.destroyRecord();
    this.router.transitionTo('index');
  }
}
