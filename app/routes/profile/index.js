import Route from '@ember/routing/route';
import { hash } from 'rsvp';

export default Route.extend({
  model(/*params*/) {
    return hash({
      articles: this.store.query('article', {
        author: this.modelFor('profile').user.get('username'),
      }),
    });
  },
});
