import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import EditorNewController from 'realworld-ember/controllers/editor/new';

module('Unit | Controller | editor/article', function(hooks) {
  setupTest(hooks);

  // Replace this with your real tests.
  test('extends from `controllers/editor/new`', function(assert) {
    const controller = this.owner.lookup('controller:editor/article');
    assert.ok(controller instanceof EditorNewController);
  });
});
