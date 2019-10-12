import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Controller | profile/favorites', function(hooks) {
  setupTest(hooks);

  test('`articles` computed property is `readOnly` of `model.favoriteArticles`', function(assert) {
    assert.expect(2);

    const controller = this.owner.lookup('controller:profile/favorites');
    const model = {
      favoriteArticles: [{ id: 1 }, { id: 2 }],
    };

    controller.set('model', model);

    assert.equal(
      controller.articles,
      model.favoriteArticles,
      '`articles` computed property should be the same array as `model.favoriteArticles`',
    );
    assert.throws(() => {
      controller.articles = [];
    }, '`articles` computed property is read only');
  });
});
