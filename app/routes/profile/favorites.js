import Route from '@ember/routing/route';
import { hash } from 'rsvp';

export default Route.extend({
  templateName: 'profile/index',
  model(/*params*/) {
    return hash({
      articles: this.store.query('article', {
        favorited: this.modelFor('profile').user.get('username'),
      }),
    });
  },
});
