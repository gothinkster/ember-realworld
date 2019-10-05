import { module } from 'qunit';
import { setupTest } from 'ember-qunit';
import test from 'ember-sinon-qunit/test-support/test';
import EmberObject from '@ember/object';

module('Unit | Route | profile/index', function(hooks) {
  setupTest(hooks);

  test('`afterModel` method loads/reloads `model.articles` relationship', async function(assert) {
    assert.expect(1);

    const route = this.owner.lookup('route:profile/index');
    const profile = EmberObject.create({
      articles: {
        reload: this.stub().resolves(),
      },
    });

    await route.afterModel(profile);

    assert.ok(
      profile.articles.reload.calledOnce,
      'Should load/reload `model.articles` relationship to ensure fresh changes',
    );
  });
});
