import { module, test } from 'qunit';
import { visit, currentURL, fillIn, click, settled } from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';
import setupMirage from 'ember-cli-mirage/test-support/setup-mirage';
import { setupLoggedOutUser } from '../helpers/user';

module('Acceptance | login', function (hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);
  setupLoggedOutUser(hooks);

  test('visiting /login', async function (assert) {
    const user = this.server.create('user', {
      email: 'bob@example.com',
      password: 'password123',
    });

    await visit('/login');

    await fillIn('[data-test-login-email]', user.email);
    await fillIn('[data-test-login-password]', user.password);

    await click('[data-test-login-button]');
    // eslint-disable-next-line ember/no-settled-after-test-helper
    await settled();

    assert.equal(currentURL(), '/', 'URL after login is Home');
    assert.dom('[data-test-nav-username]').hasText(user.username, 'Logged in username is shown');
    assert.dom('[data-test-nav-new-post]').exists('Logged in nav is shown');
    assert.dom('[data-test-nav-sign-up]').doesNotExist('Logged out nav is not shown');
  });

  test('visiting /login has link to /register', async function (assert) {
    await visit('/login');

    await click('[data-test-register-link]');

    assert.equal(currentURL(), '/register', 'URL after click is Register');
  });
});
