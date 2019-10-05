import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Controller | profile/favorites', function(hooks) {
  setupTest(hooks);

  test('`articles` computed property returns a filtered array of articles that are favorited from `model.faovirteArticles`', function(assert) {
    assert.expect(1);

    const controller = this.owner.lookup('controller:profile/favorites');
    const model = {
      favoriteArticles: [
        {
          favorited: true,
        },
        {
          favorited: false,
        },
      ],
    };

    controller.set('model', model);

    assert.equal(controller.articles.length, 1, 'Should filter out articles that are not favorited');
  });
});
