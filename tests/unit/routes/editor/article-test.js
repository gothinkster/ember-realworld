import { module } from 'qunit';
import { setupTest } from 'ember-qunit';
import EditorNewRoute from 'realworld-ember/routes/editor/new';
import test from 'ember-sinon-qunit/test-support/test';

module('Unit | Route | editor/article', function(hooks) {
  setupTest(hooks);

  test('Extends from `routes/editor/new`', function(assert) {
    const route = this.owner.lookup('route:editor/article');
    assert.ok(route instanceof EditorNewRoute);
  });

  test('`model` returns promise that resolves with an article record by ID', async function(assert) {
    const route = this.owner.lookup('route:editor/article');
    const findRecordStub = this.stub(route.store, 'findRecord').resolves();

    await route.model({ id: 'foo' });

    assert.ok(findRecordStub.calledOnceWith('article', 'foo'));
  });
});
