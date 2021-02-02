import { module, test } from 'qunit';
import faker from 'faker';
import { visit, currentURL, fillIn, click } from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';
import setupMirage from 'ember-cli-mirage/test-support/setup-mirage';
import { setupLoggedOutUser } from '../helpers/user';

module('Acceptance | register', function (hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);
  setupLoggedOutUser(hooks);

  test('successful registration', async function (assert) {
    const user = this.server.create('user', {
      name: 'Test User',
      username: 'test_user',
      email: faker.internet.email(),
      password: 'password123',
    });

    await visit('/register');

    await fillIn('[data-test-register-username]', user.username);
    await fillIn('[data-test-register-email]', user.email);
    await fillIn('[data-test-register-password]', user.password);

    await click('[data-test-register-button]');

    assert.equal(currentURL(), '/', 'URL after login is Home');
    assert.dom('[data-test-nav-username]').hasText(user.username, 'Logged in username is shown');
    assert.dom('[data-test-nav-new-post]').exists('Logged in nav is shown');
    assert.dom('[data-test-nav-sign-up]').doesNotExist('Logged out nav is not shown');
  });

  test('visiting /register has link to /login', async function (assert) {
    await visit('/register');

    await click('[data-test-login-link]');

    assert.equal(currentURL(), '/login', 'URL after click is Login');
  });
});
