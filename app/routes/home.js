import Ember from 'ember';
import { task, timeout } from 'ember-concurrency';

const DEBUG = false;

const { get } = Ember;

export default Ember.Route.extend({
  loadHorizon: 60,
  pageSize: 20,
  unloadHorizon: Infinity,

  'on-observe': function(dataset) {
    if (DEBUG) {
      console.log('dataset =', dataset); // eslint-disable-line no-console
    }
  },

  'timeout-ms': 5,

  setReadOffset: task(function*(dataset, offset) {
    yield timeout(get(this, 'timeout-ms'));
    dataset.setReadOffset(offset);
  }).restartable(),
  model() {
    return Ember.RSVP.hash({
      popularTags: this.store.findAll('tag'),
      pageSize: get(this, 'pageSize'),
      loadHorizon: get(this, 'loadHorizon'),
      columns: get(this, 'columns')
      // articles: this.store.findAll('article')
    });
  },
  actions: {
    fetch: function(pageOffset, pageSize, stats) {
      let params = {
        offset: pageOffset,
        limit: pageSize
      };
      return this.store.query('article', params).then(data => {
        // stats.totalPages = data.get('meta.total') / pageSize;
        return data.toArray();
      });
    },
    initializeReadOffset(dataset) {
      this.get('setReadOffset').perform(dataset, 0);
    },

    onObjectAt(dataset, index) {
      this.get('setReadOffset').perform(dataset, index);
    },

    logDatasetState(dataset) {
      if (DEBUG) {
        console.log('dataset =', dataset); // eslint-disable-line no-console
      }
    }
  }
});
