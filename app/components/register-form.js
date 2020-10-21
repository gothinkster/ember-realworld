import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';

export default class RegisterFormComponent extends Component {
  @tracked username = '';
  @tracked email = '';
  @tracked password = '';
  @tracked user = null;

  @service session;
  @service router;

  @action
  async submit(e) {
    e.preventDefault();
    this.user = await this.session.register(this.username, this.email, this.password);
    if (this.user.isValid) {
      this.router.transitionTo('index');
    }
  }
}
