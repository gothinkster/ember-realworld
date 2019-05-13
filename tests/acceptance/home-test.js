import { module, test } from 'qunit';
import { visit, currentURL, click } from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';
import setupMirage from 'ember-cli-mirage/test-support/setup-mirage';
import { setupLoggedInUser, setupLoggedOutUser } from '../helpers/user';

module('Acceptance | home', function(hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);
  setupLoggedOutUser(hooks);

  test('visiting /', async function(assert) {
    server.createList('article', 20);

    await visit('/');

    assert.equal(currentURL(), '/', 'The home URL is correct');
    assert.equal(
      this.element.querySelectorAll('[data-test-article-preview]').length,
      10,
      'The correct number of articles appear in the list',
    );
    assert.equal(
      this.element.querySelectorAll('[data-test-tag]').length,
      7,
      'The correct number of tags appear in the sidebar',
    );
    assert.equal(
      this.element.querySelectorAll('[data-test-page-item]').length,
      2,
      'The correct number of pages appear in the pagination list',
    );
    assert.equal(
      this.element.querySelectorAll('.feed-toggle a.nav-link').length,
      1,
      'The correct number of feed tabs appear',
    );
    assert.dom('[data-test-feed="your"]').doesNotExist('Your feed is not shown when logged out');
    assert.dom('.feed-toggle a.nav-link.active').hasText('Global Feed', 'The active tab has the correct text');
    assert.dom('ul.pagination .page-item.active a').hasText('1', 'The active page is correct in the pagination list');
  });

  test('clicking a page', async function(assert) {
    await server.createList('article', 20);

    await visit('/');
    await click('ul.pagination .page-item:nth-child(2) a');

    assert.equal(currentURL(), '/?page=2');
    assert.equal(this.element.querySelectorAll('.page-link').length, 2);
    assert.dom('ul.pagination .page-item.active a').hasText('2');
  });

  test('clicking a tag', async function(assert) {
    await visit('/');
    await click('.sidebar .tag-list a:first-child');

    assert.equal(currentURL(), '/?tag=emberjs', 'The URL has the correct tag as a query param');
    assert.equal(
      this.element.querySelectorAll('.feed-toggle a.nav-link').length,
      2,
      'The correct number of feed tabs appear',
    );
    assert.dom('.feed-toggle a.nav-link.active').hasText('emberjs', 'The active feed toggle has the correct tag name');
  });

  test('clicking a page and tag', async function(assert) {
    await server.createList('article', 20);

    await visit('/');
    await click('.sidebar .tag-list a:first-child');
    await click('[data-test-tag="training"]');

    assert.equal(currentURL(), '/?tag=training', 'The URL has the correct tag as a query param');
    assert.equal(
      this.element.querySelectorAll('.feed-toggle a.nav-link').length,
      2,
      'The correct number of feed tabs appear',
    );
    assert.dom('.feed-toggle a.nav-link.active').hasText('training', 'The active feed has the correct tag name');
    assert.dom('ul.pagination .page-item.active a').hasText('1', 'The correct page is active in the pagination list');
  });

  test('resetting to the main list', async function(assert) {
    await server.createList('article', 20);

    await visit('/?page=2&tag=emberjs');
    await click('[data-test-feed="global"]');

    assert.equal(currentURL(), '/');
    assert.equal(this.element.querySelectorAll('.feed-toggle a.nav-link').length, 1);
    assert.dom('.feed-toggle a.nav-link.active').hasText('Global Feed');
    assert.dom('ul.pagination .page-item.active a').hasText('1');
  });

  module('logged in user', function(hooks) {
    setupLoggedInUser(hooks);

    hooks.beforeEach(function() {
      server.create('user', {
        email: 'bob@example.com',
        password: 'password123',
      });
      server.get('/user', schema => {
        return schema.users.first();
      });
    });

    test('Your feed', async function(assert) {
      await server.createList('article', 20);

      server.get('/articles/feed', schema => {
        return {
          articles: [schema.articles.first()],
          articlesCount: 1,
        };
      });

      await visit('/');
      assert.equal(currentURL(), '/', 'Lands on the home page');
      assert.dom('[data-test-feed="global"].active').exists('Global feed is selected by default');
      await click('[data-test-feed="your"]');
      assert.equal(currentURL(), '/?feed=your', 'Lands on the "Your feed" page');
      assert.dom('[data-test-article-preview]').exists({ count: 1 }, 'One article is loaded on "Your feed"');
      assert.dom('[data-test-feed="your"].active').exists('Your feed is selected');
    });
  });
});
