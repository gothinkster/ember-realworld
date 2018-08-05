import Route from '@ember/routing/route';
import { hash } from 'rsvp';

export default Route.extend({
  model() {
    return hash({
      popularTags: this.store.findAll('tag'),
      articles: this.store.findAll('article')
    });
  }
});
