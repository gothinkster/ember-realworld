import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import EmberObject from '@ember/object';

module('Unit | Adapter | comment', function (hooks) {
  setupTest(hooks);

  const snapshot = {
    record: EmberObject.create({
      article: {
        id: 1,
      },
    }),
  };

  test('`pathForType` method returns the expected type', function (assert) {
    assert.expect(1);
    const adapter = this.owner.lookup('adapter:comment');

    assert.equal(adapter.pathForType(), 'articles');
  });

  test('`urlForCreateRecord` method returns expected URL', function (assert) {
    assert.expect(1);
    const adapter = this.owner.lookup('adapter:comment');
    const host = adapter.host;

    assert.equal(adapter.urlForCreateRecord('comment', snapshot), `${host}/api/articles/1/comments`);
  });

  test('`urlForUpdateRecord` method returns expected URL', function (assert) {
    assert.expect(1);
    const adapter = this.owner.lookup('adapter:comment');
    const host = adapter.host;

    assert.equal(adapter.urlForUpdateRecord(1, 'comment', snapshot), `${host}/api/articles/1/comments/1`);
  });

  test('`urlForDeleteRecord` method returns expected URL', function (assert) {
    assert.expect(1);
    const adapter = this.owner.lookup('adapter:comment');
    const host = adapter.host;

    assert.equal(adapter.urlForDeleteRecord(1, 'comment', snapshot), `${host}/api/articles/1/comments/1`);
  });
});
