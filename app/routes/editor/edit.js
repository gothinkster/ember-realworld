import Route from '@ember/routing/route';

export default class EditorEditRoute extends Route {
  model({ id }) {
    return this.store.findRecord('article', id);
  }
}
