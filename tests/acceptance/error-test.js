import { module, test } from 'qunit';
import { visit, currentURL } from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';
import setupMirage from 'ember-cli-mirage/test-support/setup-mirage';

module('Acceptance | Error', function(hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);

  test('visiting /error', async function(assert) {
    await visit('/some-BODY-once-told-me');

    assert.equal(currentURL(), '/error', 'displays error page for invalid URLs');
  });
});
