import Ember from 'ember';

const { computed } = Ember;

export default Ember.Component.extend({
  isFavorited: computed('article', {
    get() {
      //Stub until feed-item is pulled
      return true;
    }
  })
});
