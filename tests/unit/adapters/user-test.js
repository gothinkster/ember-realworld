import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Adapter | user', function(hooks) {
  setupTest(hooks);

  test('`pathForType` method returns the `modelName` that is passed to it`', function(assert) {
    assert.expect(1);

    const adapter = this.owner.lookup('adapter:user');
    assert.ok(adapter.pathForType('fooBar'), 'fooBar', 'Expect `pathForType` to return the `modelName`');
  });

  test('`urlForUpdateRecord` method returns a URL for updating a record', function(assert) {
    assert.expect(1);

    const adapter = this.owner.lookup('adapter:user');

    assert.equal(
      adapter.urlForUpdateRecord(1, 'users', {}),
      '/api/user',
      '`urlForUpdateRecord` should return expected URL',
    );
  });
});
