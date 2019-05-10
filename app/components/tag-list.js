import Component from '@ember/component';
import { task } from 'ember-concurrency';
import { inject as service } from '@ember/service';

export default Component.extend({
  store: service(),
  init() {
    this._super(...arguments);
    this.set('tags', []);
    this.loadTags.perform();
  },
  loadTags: task(function*() {
    const tags = yield this.store.findAll('tag', { reload: true });
    this.set('tags', tags);
  }).drop(),
});
