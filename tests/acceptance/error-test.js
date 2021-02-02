import { module, test } from 'qunit';
import { visit } from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';
import setupMirage from 'ember-cli-mirage/test-support/setup-mirage';
import { setupLoggedOutUser } from '../helpers/user';

module('Acceptance | Error', function (hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);
  setupLoggedOutUser(hooks);

  test('visiting /error', async function (assert) {
    await visit('/some-BODY-once-told-me');

    assert.dom('[data-test-error-page]').exists('displays error page content for invalid URLs');
  });
});
