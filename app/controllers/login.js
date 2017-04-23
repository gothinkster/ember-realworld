import Ember from 'ember';

const { set } = Ember;

export default Ember.Controller.extend({
  init() {
    this._super();

    set(this, 'errors', []);
  },

  errors: null
});
