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

  test('`normalizeArrayResponse` method normalizes an array payload', function(assert) {
    const store = this.owner.lookup('service:store');
    const serializer = store.serializerFor('tag');
    const model = store.modelFor('tag');
    const payload = {
      tags: ['foo', 'bar'],
    };
    const response = serializer.normalizeArrayResponse(store, model, payload);

    assert.deepEqual(
      response,
      {
        data: [
          {
            attributes: {
              value: 'foo',
            },
            id: 'foo',
            relationships: {},
            type: 'tag',
          },
          {
            attributes: {
              value: 'bar',
            },
            id: 'bar',
            relationships: {},
            type: 'tag',
          },
        ],
        included: [],
      },
      '`normalizeArrayResponse` should return the expected JSON-API object',
    );
  });
});
