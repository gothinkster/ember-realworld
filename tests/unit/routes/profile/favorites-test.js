import { module } from 'qunit';
import { setupTest } from 'ember-qunit';
import test from 'ember-sinon-qunit/test-support/test';
import EmberObject from '@ember/object';

module('Unit | Route | profile/favorites', function(hooks) {
  setupTest(hooks);

  test('`templateName` property value should be `profile/index` to reuse the template', function(assert) {
    assert.expect(1);

    const route = this.owner.lookup('route:profile/favorites');

    assert.equal(route.templateName, 'profile/index');
  });

  test('`afterModel` method loads/reloads `model.favoriteArticles` relationship', async function(assert) {
    assert.expect(1);

    const route = this.owner.lookup('route:profile/favorites');
    const profile = EmberObject.create({
      favoriteArticles: {
        reload: this.stub().resolves(),
      },
    });

    await route.afterModel(profile);

    assert.ok(
      profile.favoriteArticles.reload.calledOnce,
      'Should load/reload `model.favoriteArticles` relationship to ensure fresh changes',
    );
  });
});
