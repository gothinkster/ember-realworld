import { module, test } from 'qunit';
import { visit, currentURL, click, settled } from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';
import setupMirage from 'ember-cli-mirage/test-support/setup-mirage';
import { setupLoggedInUser, setupLoggedOutUser } from '../helpers/user';

module('Acceptance | index', function (hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);
  setupLoggedOutUser(hooks);

  test('visiting /', async function (assert) {
    this.server.createList('article', 20);

    await visit('/');

    assert.equal(currentURL(), '/', 'The home URL is correct');
    assert
      .dom('[data-test-article-preview]')
      .exists({ count: 10 }, 'The correct number of articles appear in the list');
    assert
      .dom('[data-test-tag]')
      .exists({ count: 7 }, 'The correct number of tags appear in the sidebar');
    assert
      .dom('[data-test-page-item]')
      .exists({ count: 2 }, 'The correct number of pages appear in the pagination list');
    assert.dom('[data-test-tab]').exists({ count: 1 }, 'The correct number of feed tabs appear');
    assert.dom('[data-test-feed="your"]').doesNotExist('Your feed is not shown when logged out');
    assert.dom('[data-test-tab="global"]').hasClass('active', 'The global tag is active');
    assert
      .dom('[data-test-page-item="1"]')
      .hasClass('active', 'The active page is correct in the pagination list');
  });

  test('clicking a page', async function (assert) {
    await this.server.createList('article', 20);

    await visit('/');
    assert
      .dom('[data-test-article-preview]')
      .exists({ count: 10 }, 'The correct number of articles appear in the list');
    await click('[data-test-page-item-link="2"]');
    assert
      .dom('[data-test-article-preview]')
      .exists(
        { count: 10 },
        'After changing page the correct number of articles appear in the list',
      );
    assert.equal(currentURL(), '/?page=2');
    assert
      .dom('[data-test-page-item="2"]')
      .hasClass('active', 'The active page is correct in the pagination list');
  });

  test('clicking a tag', async function (assert) {
    await this.server.createList('article', 20);

    await visit('/');
    assert
      .dom('[data-test-article-preview]')
      .exists({ count: 10 }, 'The correct number of articles appear in the list');
    await click('[data-test-tag="emberjs"]');

    assert
      .dom('[data-test-article-preview]')
      .exists(
        { count: 10 },
        'After changing page the correct number of articles appear in the list',
      );
    assert.equal(currentURL(), '/?tag=emberjs', 'The URL has the correct tag as a query param');
    assert
      .dom('.feed-toggle a.nav-link')
      .exists({ count: 2 }, 'The correct number of feed tabs appear');
    assert.dom('[data-test-tab="tag"]').hasClass('active', 'The tag feed toggle is active');
    assert
      .dom('[data-test-tab="tag"]')
      .hasText('#emberjs', 'The active feed toggle has the correct tag name');
  });

  test('resetting to the main list', async function (assert) {
    await this.server.createList('article', 20);

    await visit('/?page=2&tag=emberjs');
    assert
      .dom('[data-test-article-preview]')
      .exists({ count: 10 }, 'The correct number of articles appear in the list');
    await click('[data-test-tab="global"]');

    assert.equal(currentURL(), '/');
    assert
      .dom('[data-test-article-preview]')
      .exists(
        { count: 10 },
        'After changing page the correct number of articles appear in the list',
      );
    assert.dom('[data-test-tab="global"]').hasClass('active', 'The global tag is active');
    assert.dom('[data-test-page-item="1"]').hasClass('active', 'The first page is active');
  });

  module('logged in user', function (hooks) {
    setupLoggedInUser(hooks);

    hooks.beforeEach(function () {
      this.server.create('user', {
        email: 'bob@example.com',
        password: 'password123',
      });
      this.server.get('/user', (schema) => {
        return schema.users.first();
      });
    });

    test('Your feed', async function (assert) {
      await this.server.createList('article', 20);

      this.server.get('/articles/feed', (schema) => {
        return {
          articles: [schema.articles.first()],
          articlesCount: 1,
        };
      });

      await visit('/');
      assert.equal(currentURL(), '/', 'Lands on the home page');
      assert
        .dom('[data-test-tab="global"]')
        .hasClass('active', 'Global feed is selected by default');
      assert
        .dom('[data-test-article-preview]')
        .exists({ count: 10 }, 'The correct articles are shown in the list');
      await click('[data-test-tab="your"]');
      // eslint-disable-next-line ember/no-settled-after-test-helper
      await settled();

      assert.equal(currentURL(), '/?feed=your', 'Lands on the "Your feed" page');
      assert
        .dom('[data-test-article-preview]')
        .exists({ count: 1 }, 'One article is loaded on "Your feed"');
      assert.dom('[data-test-tab="your"]').hasClass('active', 'Your feed is selected');
    });
  });
});
