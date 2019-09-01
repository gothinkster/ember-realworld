import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Adapter | application', function(hooks) {
  setupTest(hooks);

  test('`headers` returns an object which may contain an `Authorization` property', function(assert) {
    assert.expect(2);
    const adapter = this.owner.lookup('adapter:application');

    assert.notOk(adapter.headers.Authorization, 'Does not contain `Authorization` when session token does not exist');

    adapter.set('session', {
      token: 'foo',
    });

    assert.equal(adapter.headers.Authorization, 'Token foo', 'Contain `Authorization` when session token exists');
  });
});
