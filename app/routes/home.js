import Ember from 'ember';

export default Ember.Route.extend({
  model() {
    return {
      tagsTemp: ['emberjs', 'test', 'programming', 'javascript', 'angularjs', 'react', 'mean', 'node', 'rails'],
      articles: this.store.findAll('article')
    };
  }
});
