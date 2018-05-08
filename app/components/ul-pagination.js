import Ember from 'ember';
const { computed } = Ember;

export default Ember.Component.extend({
  pageArray: computed('totalPages', function() {
    let actualTotal = Math.ceil(this.get('totalPages') / this.get('limit'));
    if (actualTotal < 0) return ['1'];
    return Array.from(Array(actualTotal).keys()).map(num => ++num);
  }),

  actions: {
    updatePage(page) {
      this.set('page', page);
    }
  }
});
