import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import EmberObject from '@ember/object';

module('Unit | Adapter | comment', function(hooks) {
  setupTest(hooks);

  const snapshot = {
    record: EmberObject.create({
      article: {
        id: 1,
      },
    }),
  };

  test('`pathForType` method returns the expected type', function(assert) {
    assert.expect(1);
    const adapter = this.owner.lookup('adapter:comment');

    assert.equal(adapter.pathForType(), 'articles');
  });

  test('`buildURL method returns expected URL', function(assert) {
    const adapter = this.owner.lookup('adapter:comment');
    const host = adapter.host;

    // Create record has no ID
    assert.equal(adapter.buildURL('comment', null, snapshot), `${host}/api/articles/1/comments`);

    // Delete Record has an ID.
    assert.equal(adapter.buildURL('comment', 'foo', snapshot), `${host}/api/articles/1/comments/foo`);
  });
});
