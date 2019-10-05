import { module } from 'qunit';
import { setupTest } from 'ember-qunit';
import EmberObject from '@ember/object';
import test from 'ember-sinon-qunit/test-support/test';

module('Unit | Controller | profile/index', function(hooks) {
  setupTest(hooks);

  test('`articles` computed property is `readOnly` of `model.articles`', function(assert) {
    assert.expect(2);

    const controller = this.owner.lookup('controller:profile/index');
    const model = {
      articles: [{ id: 1 }, { id: 2 }],
    };

    controller.set('model', model);

    assert.equal(
      controller.articles,
      model.articles,
      '`articles` computed property should be the same array as `model.articles`',
    );
    assert.throws(() => {
      controller.articles = [];
    }, '`articles` computed property is read only');
  });

  test('`favoriteArticle` method favorites/unfavorites an article and reloads the articles to update any changes from favoriting/unfavoriting', async function(assert) {
    assert.expect(5);

    const controller = this.owner.lookup('controller:profile/index');
    const articles = {
      reload: this.stub(),
    };
    const articleFavorited = EmberObject.create({
      favorited: true,
      favorite: this.stub().resolves(),
      unfavorite: this.stub().resolves(),
    });
    const articleUnfavorited = EmberObject.create({
      favorited: false,
      favorite: this.stub().resolves(),
      unfavorite: this.stub().resolves(),
    });

    controller.model = { articles };

    await controller.actions.favoriteArticle.call(controller, articleFavorited);
    assert.notOk(articleFavorited.favorite.called, 'Do not favorite a favorited article');
    assert.ok(articleFavorited.unfavorite.calledOnce, 'Unfavorite a favorited article');

    await controller.actions.favoriteArticle.call(controller, articleUnfavorited);
    assert.ok(articleUnfavorited.favorite.called, 'Favorite an unfavorited article');
    assert.notOk(articleUnfavorited.unfavorite.calledOnce, 'Do not unfavorite an unfavorited article');

    assert.ok(articles.reload.calledTwice, 'Reloading articles should have happend twice');
  });
});
