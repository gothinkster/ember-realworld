import { computed } from '@ember/object';
import Component from '@ember/component';

export default Component.extend({
  pageArray: computed('totalPages', {
    get() {
      const actualTotal = Math.ceil(this.get('totalPages') / this.get('limit'));
      if (actualTotal < 0) return ['1'];
      return Array.from(Array(actualTotal).keys()).map(num => ++num);
    }
  }),

  actions: {
    updatePage(page) {
      this.set('page', page);
    }
  }
});
