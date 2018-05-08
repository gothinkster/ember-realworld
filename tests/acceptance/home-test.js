import {
  module,
  test
} from 'qunit';
import {
  visit,
  currentURL,
  findAll
} from '@ember/test-helpers';
import {
  setupApplicationTest
} from 'ember-qunit';
import setupMirage from 'ember-cli-mirage/test-support/setup-mirage';

module('Acceptance | home', function (hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);

  test('visiting /', async function (assert) {
    server.createList('article', 20);

    await visit('/');

    assert.equal(currentURL(), '/');
    assert.equal(find(testSelector('article-preview')).length, 10);
    assert.equal(find(testSelector('tag-item')).length, 7);
    assert.equal(find(testSelector('page-link')).length, 2);
    assert.equal(find('.feed-toggle a.nav-link').length, 1);
    assert.equal(find('.feed-toggle a.nav-link.active').text(), 'Global Feed');
    assert.equal(find('ul.pagination .page-item.active a').text(), '1');
  });
});

test('clicking a page', function (assert) {
  server.createList('article', 20);

  visit('/');
  click('.page-item:nth-child(2) a');

  andThen(() => {
    assert.equal(currentURL(), '/?page=2');
    assert.equal(find(testSelector('page-link')).length, 2);
    assert.equal(find('ul.pagination .page-item.active a').text(), '2');
  });
});

test('clicking a tag', function (assert) {
  visit('/');
  click('.tag-list a:first-child');

  andThen(() => {
    assert.equal(currentURL(), '/?tag=emberjs');
    assert.equal(find('.feed-toggle a.nav-link').length, 2);
    assert.equal(find('.feed-toggle a.nav-link.active').text(), 'emberjs');
  });
});

test('clicking a page and tag', function (assert) {
  server.createList('article', 20);

  visit('/');
  click('.tag-list a:first-child');
  click('.page-item:nth-child(2) a');

  andThen(() => {
    assert.equal(currentURL(), '/?page=2&tag=emberjs');
    assert.equal(find('.feed-toggle a.nav-link').length, 2);
    assert.equal(find('.feed-toggle a.nav-link.active').text(), 'emberjs');
    assert.equal(find('ul.pagination .page-item.active a').text(), '2');
  });
});

test('resetting to the main list', function(assert) {
  server.createList('article', 20);

  visit('/?page=2&tag=emberjs');
  click('.feed-toggle a.nav-link:first-child');

  andThen(() => {
    assert.equal(currentURL(), '/');
    assert.equal(find('.feed-toggle a.nav-link').length, 1);
    assert.equal(find('.feed-toggle a.nav-link.active').text(), 'Global Feed');
    assert.equal(find('ul.pagination .page-item.active a').text(), '1');
  });
});
