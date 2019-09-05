import { module, test } from 'qunit';
import { click, visit, currentURL, settled, fillIn, triggerEvent, currentRouteName } from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';
import setupMirage from 'ember-cli-mirage/test-support/setup-mirage';
import { setupLoggedInUser } from '../helpers/user';

module('Acceptance | article', function(hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);
  setupLoggedInUser(hooks);

  let user;

  hooks.beforeEach(function() {
    user = server.create('user', {
      email: 'bob@example.com',
      password: 'password123',
    });
    server.get('/user', schema => {
      return schema.users.first();
    });
  });

  test('visiting /article/:slug', async function(assert) {
    const profile = await server.create('profile');
    const article = await server.create('article', {
      author: profile,
    });

    await visit(`/article/${article.slug}`);

    assert.equal(currentURL(), `/article/${article.slug}`);
  });

  test('favorite article', async function(assert) {
    const profile = await server.create('profile');
    const article = await server.create('article', {
      author: profile,
      favorited: false,
    });

    await visit(`/article/${article.slug}`);
    await click('[data-test-favorite-article-button]');
    await settled();
    // Update the data that's been changed in this instance
    article.reload();

    assert.ok(article.favorited, 'Expected article to be favorited');

    await click('[data-test-favorite-article-button]');
    await settled();
    // Update the data that's been changed in this instance
    article.reload();

    assert.notOk(article.favorited, 'Expected article to be unfavorited');
  });

  test('follow author', async function(assert) {
    const profile = await server.create('profile', {
      following: false,
    });
    const article = await server.create('article', {
      author: profile,
      favorited: false,
    });

    await visit(`/article/${article.slug}`);
    await click('[data-test-follow-author-button]');
    await settled();
    // Update the data that's been changed in this instance
    profile.reload();

    assert.ok(profile.following, 'Expected author to be followed');

    await click('[data-test-follow-author-button]');
    await settled();
    // Update the data that's been changed in this instance
    profile.reload();

    assert.notOk(profile.following, 'Expected author to be unfollowed');
  });

  test('edit article', async function(assert) {
    const userProfile = await server.schema.profiles.findBy({ username: user.username });
    const article = await server.create('article', {
      author: userProfile,
    });

    await visit(`/article/${article.slug}`);

    await click('[data-test-edit-article-button]');

    assert.equal(
      currentRouteName(),
      'editor.article',
      'Expect to transition to `editor.article` page to edit the article',
    );
  });

  test('delete article', async function(assert) {
    const userProfile = await server.schema.profiles.findBy({ username: user.username });
    const article = await server.create('article', {
      author: userProfile,
    });

    await visit(`/article/${article.slug}`);

    await click('[data-test-delete-article-button]');
    await settled();

    assert.equal(currentRouteName(), 'home', 'Expected to transition to index when article is deleted');
  });

  test('post comment', async function(assert) {
    const profile = await server.create('profile');
    const article = await server.create('article', {
      author: profile,
    });
    const message = 'foo!';

    await visit(`/article/${article.slug}`);

    assert.dom('[data-test-article-comment]').doesNotExist();

    await fillIn('[data-test-article-comment-textarea]', message);
    await triggerEvent('[data-test-article-comment-form]', 'submit');

    const comments = server.schema.comments.where({ authorId: user.id });
    assert.equal(comments.length, 1, 'Expect a server request to save 1 comment');

    assert.dom('[data-test-article-comment]').exists({ count: 1 });
  });

  test('delete comment', async function(assert) {
    const profile = await server.create('profile');
    const userProfile = await server.schema.profiles.findBy({
      username: user.username,
    });
    const article = await server.create('article', {
      author: profile,
    });

    await server.createList('comments', 1, {
      article,
      author: userProfile,
    });

    await visit(`/article/${article.slug}`);

    assert.dom('[data-test-article-comment]').exists({ count: 1 });

    await click('[data-test-article-comment-delete-button]');

    assert.dom('[data-test-article-comment]').doesNotExist();
  });
});
