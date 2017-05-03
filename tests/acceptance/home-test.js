import { test } from 'qunit';
import moduleForAcceptance from 'realworld-ember/tests/helpers/module-for-acceptance';

moduleForAcceptance('Acceptance | home');

test('visiting /', function(assert) {
  server.createList('article');

  visit('/');

  andThen(() => {
    assert.equal(currentURL(), '/');
    assert.equal(this.$('.article-preview').length, 20);
  });
});
