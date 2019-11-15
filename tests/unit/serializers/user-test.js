import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

import { run } from '@ember/runloop';

module('Unit | Serializer | user', function(hooks) {
  setupTest(hooks);

  // Replace this with your real tests.
  test('it serializes records', function(assert) {
    assert.expect(5);
    const record = run(() => this.owner.lookup('service:store').createRecord('user', { id: 'foo' }));

    let serializedRecord = record.serialize();
    assert.ok(serializedRecord);
    assert.equal(serializedRecord.id, 'foo', 'Expect the serialized record to contain the record ID');
    assert.equal(serializedRecord.password, null, 'falsey `password` should be removed from the serialized record');

    record.set('password', ' ');
    serializedRecord = record.serialize();
    assert.equal(
      serializedRecord.password,
      null,
      '`password` with only white space should be removed from the serialized record',
    );

    record.set('password', 'abc');
    serializedRecord = record.serialize();
    assert.equal(serializedRecord.password, 'abc', 'truthy `password` should be included in the serialized record');
  });
});
