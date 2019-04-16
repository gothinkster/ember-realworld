import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

import { run } from '@ember/runloop';

module('Unit | Serializer | tag', function(hooks) {
  setupTest(hooks);

  // Replace this with your real tests.
  test('it serializes records', function(assert) {
    const record = run(() => this.owner.lookup('service:store').createRecord('tag'));

    const serializedRecord = record.serialize();

    assert.ok(serializedRecord);
  });
});
