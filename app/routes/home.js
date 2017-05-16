import Ember from 'ember';
import { task, timeout } from 'ember-concurrency';

const DEBUG = true;

const { get } = Ember;

export default Ember.Route.extend({
  // loadHorizon: 10,
  initialReadOffset: 0,
  pageSize: 5,
  // unloadHorizon: 60,

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
      loadHorizon: get(this, 'loadHorizon')
      // articles: this.store.findAll('article')
    });
  },
  actions: {
    fetch: function(pageOffset, pageSize, stats) {
      let params = {
        offset: pageOffset * pageSize,
        limit: pageSize
      };
      return this.store.query('article', params).then(data => {
        stats.totalPages = data.get('meta.total') / pageSize;
        return data.toArray();
      });
    },
    initializeReadOffset(dataset) {
      /*this.get('setReadOffset').perform(dataset, 0);*/
      let initReadOffset = this.get('initialReadOffset');
      dataset.setReadOffset(initReadOffset);
    },

    changeOffset(dataset, index) {
      dataset.setReadOffset(index * get(this, 'pageSize'));
    },

    /*    onObjectAt(dataset, index) {
      this.get('setReadOffset').perform(dataset, index);
    },*/

    logDatasetState(dataset) {
      if (DEBUG) {
        console.log('dataset =', dataset); // eslint-disable-line no-console
      }
    }
  }
});
