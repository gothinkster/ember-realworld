import { moduleForModel, test } from 'ember-qunit';

moduleForModel('article', 'Unit | Serializer | article', {
  needs: ['serializer:article', 'model:user', 'model:tag']
});

// Replace this with your real tests.
test('it serializes records', function(assert) {
  let record = this.subject();

  let serializedRecord = record.serialize();

  assert.ok(serializedRecord);
});
