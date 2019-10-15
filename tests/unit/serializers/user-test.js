import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

import { run } from '@ember/runloop';

module('Unit | Serializer | user', function(hooks) {
  setupTest(hooks);

  // Replace this with your real tests.
  test('it serializes records', function(assert) {
    assert.expect(2);
    const record = run(() => this.owner.lookup('service:store').createRecord('user', { id: 'foo' }));

    const serializedRecord = record.serialize();

    assert.ok(serializedRecord);
    assert.equal(serializedRecord.id, 'foo', 'Expect the serialized record to contain the record ID');
  });
});
