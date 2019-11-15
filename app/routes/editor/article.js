import NewRoute from './new';

export default NewRoute.extend({
  model({ slug }) {
    return this.store.findRecord('article', slug);
  },
});
