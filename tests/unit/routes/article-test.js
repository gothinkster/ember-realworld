import { module } from 'qunit';
import { setupTest } from 'ember-qunit';
import test from 'ember-sinon-qunit/test-support/test';

module('Unit | Route | article', function(hooks) {
  setupTest(hooks);

  test('`model` finds a article by `id` param', async function(assert) {
    assert.expect(1);

    const route = this.owner.lookup('route:article');
    const findRecordStub = this.stub(route.store, 'findRecord').resolves();
    const id = 1;

    await route.model({ id });

    assert.ok(findRecordStub.calledOnceWith('article', id), 'Find an `article` record by ID');
  });
});
