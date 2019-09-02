import Helper from '@ember/component/helper';
import { inject as service } from '@ember/service';

export default Helper.extend({
  router: service(),

  compute([routeName, ...params]) {
    return (...invocationArgs) => {
      return this.router.transitionTo(routeName, ...params.concat(invocationArgs));
    };
  },
});
