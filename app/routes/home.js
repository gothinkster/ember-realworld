import Ember from 'ember';
import { task, timeout } from 'ember-concurrency';

const DEBUG = true;

const { get } = Ember;

export default Ember.Route.extend({
  queryParams: {
    page: {
      refreshModel: true
    }
  },
  initialReadOffset: 0,
  pageSize: 5,

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
  resetReadOffset: task(function*(dataset, offset) {
    yield timeout(get(this, 'timeout-ms'));
    dataset.reset(offset);
  }).restartable(),

  model(params) {
    this.set('page', params.page);
    return Ember.RSVP.hash({
      popularTags: this.store.findAll('tag'),
      pageSize: get(this, 'pageSize')
    });
  },
  resetController(controller, isExiting, transition) {
    let page = transition.queryParams.page || 0;
    let dataset = get(this, 'dataset');
    if (!isExiting) {
      get(this, 'resetReadOffset').perform(dataset, page);
    }
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
      let initReadOffset = get(this, 'page');
      dataset.setReadOffset(initReadOffset);
    },

    onObserve(dataset) {
      this.set('dataset', dataset);
      if (DEBUG) {
        console.log('dataset =', dataset); // eslint-disable-line no-console
      }
    }
  }
});
