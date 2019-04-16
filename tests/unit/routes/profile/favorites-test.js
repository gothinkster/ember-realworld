import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Route | profile/favorites', function(hooks) {
  setupTest(hooks);

  test('it exists', function(assert) {
    const route = this.owner.lookup('route:profile/favorites');
    assert.ok(route);
  });
});
