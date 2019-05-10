import { computed } from '@ember/object';
import Component from '@ember/component';

export default Component.extend({
  tagName: 'nav',
  pages: computed('total', 'pageSize', function() {
    if (!this.total) {
      return [];
    }
    const pages = Math.ceil(this.total / this.pageSize);
    return Array.from(Array(pages).keys()).map(num => ++num);
  }),
});
