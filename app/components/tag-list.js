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
    /**
     * Query for popular tags.
     * Using findAll would return a live array that would get populated with tags from articles, which may/may-not be popular tags.
     */
    const tags = yield this.store.query('tag', {});
    this.set('tags', tags);
  }).drop(),
});
