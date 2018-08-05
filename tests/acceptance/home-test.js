import { module, test } from 'qunit';
import { visit, currentURL, findAll } from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';
import setupMirage from 'ember-cli-mirage/test-support/setup-mirage';

module('Acceptance | home', function(hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);

  test('visiting /', async function(assert) {
    server.createList('article', 20);

    await visit('/');

    assert.equal(currentURL(), '/');
    assert.equal(findAll('[data-test-article-preview]').length, 20);
  });
});
