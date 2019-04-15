import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Route | profile/index', function(hooks) {
  setupTest(hooks);

  test('it exists', function(assert) {
    const route = this.owner.lookup('route:profile/index');
    assert.ok(route);
  });
});
