import { module, test } from 'qunit';
import { visit, currentURL, click } from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';
import setupMirage from 'ember-cli-mirage/test-support/setup-mirage';
import { setupLoggedOutUser } from '../helpers/user';

module('Acceptance | home', function(hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);
  setupLoggedOutUser(hooks);

  test('visiting /', async function(assert) {
    server.createList('article', 20);

    await visit('/');

    assert.equal(currentURL(), '/');
    assert.equal(this.element.querySelectorAll('[data-test-article-preview]').length, 10);
    assert.equal(this.element.querySelectorAll('[data-test-tag-item]').length, 7);
    assert.equal(this.element.querySelectorAll('[data-test-page-link]').length, 2);
    assert.equal(this.element.querySelectorAll('.feed-toggle a.nav-link').length, 1);
    assert.dom('.feed-toggle a.nav-link.active').hasText('Global Feed');
    assert.dom('ul.pagination .page-item.active a').hasText('1');
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

    assert.equal(currentURL(), '/?tag=emberjs');
    assert.equal(this.element.querySelectorAll('.feed-toggle a.nav-link').length, 2);
    assert.dom('.feed-toggle a.nav-link.active').hasText('emberjs');
  });

  test('clicking a page and tag', async function(assert) {
    await server.createList('article', 20);

    await visit('/');
    await click('.sidebar .tag-list a:first-child');
    await click('ul.pagination .page-item:nth-child(2) a');

    assert.equal(currentURL(), '/?page=2&tag=emberjs');
    assert.equal(this.element.querySelectorAll('.feed-toggle a.nav-link').length, 2);
    assert.dom('.feed-toggle a.nav-link.active').hasText('emberjs');
    assert.dom('ul.pagination .page-item.active a').hasText('2');
  });

  test('resetting to the main list', async function(assert) {
    await server.createList('article', 20);

    await visit('/?page=2&tag=emberjs');
    await click('.feed-toggle a.nav-link:first-child');

    assert.equal(currentURL(), '/');
    assert.equal(this.element.querySelectorAll('.feed-toggle a.nav-link').length, 1);
    assert.dom('.feed-toggle a.nav-link.active').hasText('Global Feed');
    assert.dom('ul.pagination .page-item.active a').hasText('1');
  });
});
