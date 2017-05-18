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
  model(params) {
    this.set('page', params.page);
    return Ember.RSVP.hash({
      popularTags: this.store.findAll('tag'),
      pageSize: get(this, 'pageSize'),
      loadHorizon: get(this, 'loadHorizon')
    });
  },
  resetController(controller, isExiting, transition) {
    let page = transition.queryParams.page;
    if (!isExiting) {
      this._resetOffset(get(this, 'dataset'));
      this._changeOffset(get(this, 'dataset'), page);
    }
  },
  _changeOffset(dataset, page) {
    get(this, 'setReadOffset').perform(dataset, page);
  },
  _resetOffset(dataset) {
    dataset.reset();
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

    changeOffset(dataset, page) {
      dataset.setReadOffset(page);
    },

    /*    onObjectAt(dataset, index) {
      this.get('setReadOffset').perform(dataset, index);
    },*/

    logDatasetState(dataset) {
      this.set('dataset', dataset);

      if (DEBUG) {
        console.log('dataset =', dataset); // eslint-disable-line no-console
      }
    }
  }
});
