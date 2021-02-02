import { module, test } from 'qunit';
import { click, visit, currentURL, fillIn, currentRouteName, settled } from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';
import setupMirage from 'ember-cli-mirage/test-support/setup-mirage';
import { setupLoggedInUser } from '../helpers/user';

module('Acceptance | article', function (hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);
  setupLoggedInUser(hooks);

  let user;

  hooks.beforeEach(function () {
    user = this.server.create('user', {
      email: 'bob@example.com',
      password: 'password123',
    });
    this.server.get('/user', (schema) => {
      return schema.users.first();
    });
  });

  test('visiting /articles/:slug', async function (assert) {
    const profile = await this.server.create('profile');
    const article = await this.server.create('article', {
      author: profile,
    });

    await visit(`/articles/${article.slug}`);

    assert.equal(currentURL(), `/articles/${article.slug}`);
  });

  test('favorite article', async function (assert) {
    const profile = await this.server.create('profile');
    const article = await this.server.create('article', {
      author: profile,
      favorited: false,
    });

    await visit(`/articles/${article.slug}`);

    await click('[data-test-favorite-article-button]');
    // eslint-disable-next-line ember/no-settled-after-test-helper
    await settled();

    assert.ok(article.favorited, 'Expected article to be favorited');

    await click('[data-test-favorite-article-button]');

    assert.notOk(article.favorited, 'Expected article to be unfavorited');
  });

  test('follow author', async function (assert) {
    const profile = await this.server.create('profile', {
      following: false,
    });
    const article = await this.server.create('article', {
      author: profile,
      favorited: false,
    });

    await visit(`/articles/${article.slug}`);

    await click('[data-test-follow-author-button]');
    // eslint-disable-next-line ember/no-settled-after-test-helper
    await settled();

    assert.dom('[data-test-follow-author-button]').hasTextContaining('Unfollow');

    await click('[data-test-follow-author-button]');
    // eslint-disable-next-line ember/no-settled-after-test-helper
    await settled();

    assert.dom('[data-test-follow-author-button]').hasTextContaining('Follow');
  });

  test('edit article', async function (assert) {
    const userProfile = await this.server.schema.profiles.findBy({ username: user.username });
    const article = await this.server.create('article', {
      author: userProfile,
    });

    await visit(`/articles/${article.slug}`);

    await click('[data-test-edit-article-button]');
    assert.equal(
      currentRouteName(),
      'editor.edit',
      'Expect to transition to `editor.article` page to edit the article',
    );
    assert.dom('[data-test-article-form-input-title]').hasValue(article.title);
  });

  test('delete article', async function (assert) {
    assert.expect(1);

    const userProfile = await this.server.schema.profiles.findBy({ username: user.username });
    const article = await this.server.create('article', {
      author: userProfile,
    });

    await visit(`/articles/${article.slug}`);

    await click('[data-test-delete-article-button]');

    assert.equal(
      currentRouteName(),
      'index',
      'Expected to transition to index when article is deleted',
    );
  });

  test('post comment', async function (assert) {
    assert.expect(3);

    const profile = await this.server.create('profile');
    const article = await this.server.create('article', {
      author: profile,
    });
    const message = 'foo!';

    await visit(`/articles/${article.slug}`);

    assert.dom('[data-test-article-comment]').doesNotExist();

    await fillIn('[data-test-article-comment-textarea]', message);
    await click('[data-test-article-comment-button]');

    assert.dom('[data-test-article-comment]').exists({ count: 1 });
    assert.dom('[data-test-article-comment-body]').hasText('foo!');
  });

  test('delete comment', async function (assert) {
    assert.expect(2);

    const profile = await this.server.create('profile');
    const userProfile = await this.server.schema.profiles.findBy({
      username: user.username,
    });
    const article = await this.server.create('article', {
      author: profile,
    });

    await this.server.createList('comment', 1, {
      article,
      author: userProfile,
    });

    await visit(`/articles/${article.slug}`);

    assert.dom('[data-test-article-comment]').exists({ count: 1 });

    await click('[data-test-article-comment-delete-button]');

    assert.dom('[data-test-article-comment]').doesNotExist();
  });
});
