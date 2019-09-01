import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Controller | article', function(hooks) {
  setupTest(hooks);

  const date = new Date();
  const dateISOString = date.toISOString();
  const article = {
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
    title: 'Feed Item Title',
    body: '# Markdown!',
  };
  const comments = [
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
});
