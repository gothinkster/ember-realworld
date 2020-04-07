import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';
import { task } from 'ember-concurrency-decorators';

export default class TagListComponent extends Component {
  @service session;
  @tracked tags = [];

  constructor() {
    super(...arguments);
    this.loadTags.perform();
  }

  @task({ restartable: true })
  *loadTags() {
    let { tags } = yield this.session.fetch('/tags');
    this.tags = tags;
  }
}
