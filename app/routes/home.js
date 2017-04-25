import Ember from 'ember';

export default Ember.Route.extend({
  model: function() {
    return {
      articleContent: Ember.String.htmlSafe(
        '<h1>Want to help out?</h1><p>Check out our GitHub!</p><span>Go Now...</span>'
      ),
      articles: this.store.findAll('article')
    };
  }
});
