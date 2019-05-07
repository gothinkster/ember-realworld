import { module, test } from 'qunit';
import { visit, currentURL, fillIn, click, find, settled } from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';
import setupMirage from 'ember-cli-mirage/test-support/setup-mirage';
import { setupLoggedOutUser } from '../helpers/user';

module('Acceptance | login', function(hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);
  setupLoggedOutUser(hooks);

  test('visiting /login', async function(assert) {
    const user = server.create('user', {
      email: 'bob@example.com',
      password: 'password123',
    });

    await visit('/login');

    await fillIn('[data-test-email]', user.email);
    await fillIn('[data-test-password]', user.password);

    await click('[data-test-login]');
    await settled();

    assert.equal(currentURL(), '/', 'URL after login is Home');
    assert.ok(find('[data-test-currentUser-loggedIn]').text.length, 'Found currentUser profile link');
  });
});
