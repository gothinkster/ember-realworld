import { module, test } from 'qunit';
import { visit, currentURL, fillIn, click, find } from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';
import setupMirage from 'ember-cli-mirage/test-support/setup-mirage';

module('Acceptance | login', function(hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);

  test('visiting /login', async assert => {
    const user = server.create('user', { email: 'bob@example.com', password: 'password123' });

    await visit('/login');

    await fillIn('[data-test-email]', user.email);
    await fillIn('[data-test-password]', user.password);

    await click('[data-test-login]');

    assert.equal(currentURL(), '/', 'URL after login is Home');
    assert.ok(find('[data-test-currentUser-loggedIn]').text.length, 'Found currentUser profile link');
  });
});
