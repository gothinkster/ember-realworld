import Controller from '@ember/controller';
import { inject as service } from '@ember/service';

export default Controller.extend({
  session: service(),
  queryParams: ['feed', 'tag', 'page'],
  feed: null,
  tag: null,
  page: 1,
});
