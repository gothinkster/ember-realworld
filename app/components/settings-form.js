import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';

export default class SettingsFormComponent extends Component {
  @service session;

  willDestroy() {
    super.willDestroy(...arguments);
    if (this.session.user.hasDirtyAttributes) {
      this.session.user.rollbackAttributes();
    }
  }

  @action
  async submit(e) {
    e.preventDefault();
    try {
      await this.session.user.save();
    } catch {
      // Catch any save errors
    }
  }
}
