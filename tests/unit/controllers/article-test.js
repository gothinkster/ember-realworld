import { module } from 'qunit';
import { setupTest } from 'ember-qunit';
import EmberObject from '@ember/object';
import test from 'ember-sinon-qunit/test-support/test';

module('Unit | Controller | article', function(hooks) {
  setupTest(hooks);

  let date;
  let dateISOString;
  let article;
  let comments;

  hooks.beforeEach(function() {
    date = new Date();
    dateISOString = date.toISOString();
    article = {
      author: {
        image: 'https://static.productionready.io/images/smiley-cyrus.jpg',
        id: 'AlonBukai',
        following: false,
      },
      createdAt: dateISOString,
      updatedAt: dateISOString,
      favorited: false,
      favoritesCount: 9000,
      tagList: ['firstTag', 'secondTag', 'thirdTag'],
      description: 'This is feed item description',
      slug: 'feed-item-title',
      id: 'feed-item-title',
      title: 'Feed Item Title',
      body: '# Markdown!',
    };
    comments = [
      {
        id: 1,
        createdAt: dateISOString,
        updatedAt: dateISOString,
        body: 'Comment 1',
        author: {
          image: 'https://static.productionready.io/images/smiley-cyrus.jpg',
          id: 'Foo',
          following: false,
        },
        article,
      },
      {
        id: 2,
        createdAt: dateISOString,
        updatedAt: dateISOString,
        body: 'Comment 2',
        author: {
          image: 'https://static.productionready.io/images/smiley-cyrus.jpg',
          id: 'Bar',
          following: false,
        },
        article,
      },
    ];

    article.comments = comments;
  });

  test('`comments` are sorted by `id` in descending order', function(assert) {
    assert.expect(1);

    const controller = this.owner.lookup('controller:article');
    controller.set('model', article);

    const commentIds = controller.get('comments').map(comment => comment.id);
    assert.equal(commentIds.join(), '2,1');
  });

  test('`articleBody` is markdown converted to HTML safe string', function(assert) {
    assert.expect(1);

    const controller = this.owner.lookup('controller:article');
    controller.set('model', article);

    const articleBody = controller.get('articleBody');

    assert.equal(articleBody.string.trim(), '<h1 id="markdown">Markdown!</h1>');
  });

  test('`newComment` tracks string changes and updates when `model` changes', function(assert) {
    assert.expect(3);

    const controller = this.owner.lookup('controller:article');
    controller.set('model', article);

    assert.equal(controller.get('newComment'), '', 'should default to empty string');

    controller.set('newComment', 'New Comment!');

    assert.equal(
      controller.get('newComment'),
      'New Comment!',
      'Ensure a new string is stored before resetting by changing the `model`',
    );

    controller.set('model', null);

    assert.equal(controller.get('newComment'), '', 'should reset to the default when `model` changes');
  });

  test('`isNewCommentValid` validates the new comment', function(assert) {
    assert.expect(4);

    const controller = this.owner.lookup('controller:article');
    controller.set('model', article);

    assert.equal(controller.get('newComment'), '', 'New comment should be an empty string by default');
    assert.notOk(controller.get('isNewCommentValid'), 'New comment should be invalid because it is an empty string');

    controller.set('newComment', '   ');
    assert.notOk(controller.get('isNewCommentValid'), 'New comment should be invalid because it only has spaces');

    controller.set('newComment', ' a ');
    assert.ok(
      controller.get('isNewCommentValid'),
      'New comment should be valid because there is a non-space character in the string.',
    );
  });

  test('`createComment` method creates a new comment record', async function(assert) {
    assert.expect(3);

    const controller = this.owner.lookup('controller:article');
    const store = controller.store;
    const message = 'foo bar';
    const createRecordStub = this.stub(store, 'createRecord');
    const article = {
      save: this.stub().resolves(),
    };
    createRecordStub.returns(article);

    await controller.actions.createComment.call(controller, article, message);

    assert.ok(
      createRecordStub.calledOnceWith('comment', { article, body: message }),
      'Create a `comment` record with expected properties',
    );
    assert.ok(article.save.calledOnce, 'New `comment` record should be saved');
    assert.equal(controller.get('newComment'), '', '`controller.newComment` should be reset to an empty string');
  });

  test('`deleteComment` method deletes a comment record', async function(assert) {
    assert.expect(1);

    const controller = this.owner.lookup('controller:article');
    const comment = {
      destroyRecord: this.stub().resolves(),
    };

    await controller.actions.deleteComment.call(controller, comment);

    assert.ok(comment.destroyRecord.calledOnce, '`comment.destroyRecord` shoud be executed');
  });

  test('`favoriteArticle` method favorites/unfavorites an article', async function(assert) {
    assert.expect(4);

    const controller = this.owner.lookup('controller:article');
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

    await controller.actions.favoriteArticle.call(controller, articleFavorited);
    assert.notOk(articleFavorited.favorite.called, 'Do not favorite a favorited article');
    assert.ok(articleFavorited.unfavorite.calledOnce, 'Unfavorite a favorited article');

    await controller.actions.favoriteArticle.call(controller, articleUnfavorited);
    assert.ok(articleUnfavorited.favorite.called, 'Favorite an unfavorited article');
    assert.notOk(articleUnfavorited.unfavorite.calledOnce, 'Do not unfavorite an unfavorited article');
  });

  test('`followAuthor` method follows/unfollows an author', async function(assert) {
    assert.expect(4);

    const controller = this.owner.lookup('controller:article');
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

    await controller.actions.followAuthor.call(controller, authorFollowed);
    assert.notOk(authorFollowed.follow.called, 'Do not follow a author who is already followed');
    assert.ok(authorFollowed.unfollow.calledOnce, 'Unfollow an author who is followed');

    await controller.actions.followAuthor.call(controller, authorUnfollowed);
    assert.ok(authorUnfollowed.follow.called, 'Follow an author who is not followed');
    assert.notOk(authorUnfollowed.unfollow.calledOnce, 'Do not unfollow an author who not followed');
  });

  test('`deleteArticle` method deletes an article and transitions to home', async function(assert) {
    assert.expect(2);

    const controller = this.owner.lookup('controller:article');
    const article = {
      destroyRecord: this.stub().resolves(),
    };
    const transitionToRouteStub = this.stub(controller, 'transitionToRoute');

    await controller.actions.deleteArticle.call(controller, article);

    assert.ok(article.destroyRecord.calledOnce, 'Execute `article.destroyRecord` method to delete the record');
    assert.ok(transitionToRouteStub.calledOnceWith('home'), 'Transition to `home` route');
  });
});
