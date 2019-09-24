import NewRoute from './new';

export default NewRoute.extend({
  model({ id }) {
    return this.store.findRecord('article', id);
  },
});
