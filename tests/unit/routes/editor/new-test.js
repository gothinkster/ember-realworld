import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Route | editor/new', function(hooks) {
  setupTest(hooks);

  test('it exists', function(assert) {
    const route = this.owner.lookup('route:editor/new');
    assert.ok(route);
  });
});
