import { module } from 'qunit';
import { setupTest } from 'ember-qunit';
import test from 'ember-sinon-qunit/test-support/test';
import EmberObject from '@ember/object';

module('Unit | Route | article', function(hooks) {
  setupTest(hooks);

  test('`model` finds a article by `slug` param', async function(assert) {
    assert.expect(1);

    const route = this.owner.lookup('route:article');
    const findRecordStub = this.stub(route.store, 'findRecord').resolves();
    const slug = 1;

    await route.model({ slug });

    assert.ok(findRecordStub.calledOnceWith('article', slug), 'Find an `article` record by ID (slug)');
  });

  test('`createComment` method creates a new comment record', async function(assert) {
    assert.expect(3);

    const route = this.owner.lookup('route:article');
    const store = route.store;
    const message = 'foo bar';
    const createRecordStub = this.stub(store, 'createRecord');
    const article = {
      save: this.stub().resolves(),
    };
    const controller = {
      set: this.stub(),
    };
    createRecordStub.returns(article);
    route.controller = controller;

    await route.actions.createComment.call(route, article, message);

    assert.ok(
      createRecordStub.calledOnceWith('comment', { article, body: message }),
      'Create a `comment` record with expected properties',
    );
    assert.ok(article.save.calledOnce, 'New `comment` record should be saved');
    assert.ok(
      controller.set.calledOnceWith('newComment', ''),
      '`controller.newComment` should be reset to an empty string',
    );
  });

  test('`deleteComment` method deletes a comment record', async function(assert) {
    assert.expect(1);

    const route = this.owner.lookup('route:article');
    const comment = {
      destroyRecord: this.stub().resolves(),
    };

    await route.actions.deleteComment.call(route, comment);

    assert.ok(comment.destroyRecord.calledOnce, '`comment.destroyRecord` shoud be executed');
  });

  test('`favoriteArticle` method favorites/unfavorites an article', async function(assert) {
    assert.expect(4);

    const route = this.owner.lookup('route:article');
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

    await route.actions.favoriteArticle.call(route, articleFavorited);
    assert.notOk(articleFavorited.favorite.called, 'Do not favorite a favorited article');
    assert.ok(articleFavorited.unfavorite.calledOnce, 'Unfavorite a favorited article');

    await route.actions.favoriteArticle.call(route, articleUnfavorited);
    assert.ok(articleUnfavorited.favorite.called, 'Favorite an unfavorited article');
    assert.notOk(articleUnfavorited.unfavorite.calledOnce, 'Do not unfavorite an unfavorited article');
  });

  test('`followAuthor` method follows/unfollows an author', async function(assert) {
    assert.expect(4);

    const route = this.owner.lookup('route:article');
    const authorFollowed = EmberObject.create({
      following: true,
      follow: this.stub().resolves(),
      unfollow: this.stub().resolves(),
    });
    const authorUnfollowed = EmberObject.create({
      following: false,
      follow: this.stub().resolves(),
      unfollow: this.stub().resolves(),
    });

    await route.actions.followAuthor.call(route, authorFollowed);
    assert.notOk(authorFollowed.follow.called, 'Do not follow a author who is already followed');
    assert.ok(authorFollowed.unfollow.calledOnce, 'Unfollow an author who is followed');

    await route.actions.followAuthor.call(route, authorUnfollowed);
    assert.ok(authorUnfollowed.follow.called, 'Follow an author who is not followed');
    assert.notOk(authorUnfollowed.unfollow.calledOnce, 'Do not unfollow an author who not followed');
  });
});
