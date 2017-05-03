import { test } from 'qunit';
import testSelector from 'ember-test-selectors';
import moduleForAcceptance from 'realworld-ember/tests/helpers/module-for-acceptance';

moduleForAcceptance('Acceptance | home');

test('visiting /', function(assert) {
  server.createList('article', 20);

  visit('/');

  andThen(() => {
    assert.equal(currentURL(), '/');
    assert.ok(testSelector('article-preview').length);
  });
});
