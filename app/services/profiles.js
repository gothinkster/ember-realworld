import Service from '@ember/service';
import { inject as service } from '@ember/service';
export default Service.extend({
  store: service(),

  followUser(userName) {
    const adapter = this.store.adapterFor('user');
    return adapter.followUser(userName);
  },
  unFollowUser(userName) {
    const adapter = this.store.adapterFor('user');
    return adapter.unFollowUser(userName);
  },
});
