import { module, test } from 'qunit';
import { find, fillIn, visit, currentURL, click, currentRouteName } from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';
import setupMirage from 'ember-cli-mirage/test-support/setup-mirage';
import { setupLoggedInUser, setupLoggedOutUser } from '../helpers/user';
import { all } from 'rsvp';

module('Acceptance | settings', function (hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);

  module('logged-out user', function () {
    setupLoggedOutUser(hooks);

    test('visiting /settings redirects to login', async function (assert) {
      await visit('/settings');

      assert.equal(currentURL(), '/login');
    });
  });

  module('logged-in user', function (hooks) {
    setupLoggedInUser(hooks, 'token');

    hooks.beforeEach(function () {
      this.server.create('user', {
        email: 'bob@example.com',
        password: 'password123',
      });

      this.server.get('/user', (schema) => {
        return schema.users.first();
      });
    });

    test('can edit their settings', async function (assert) {
      await visit('/settings');

      const newSettings = {
        image: 'image',
        bio: 'bio',
        username: 'username',
        password: 'password',
        email: 'email@email.com',
      };

      assert.notEqual(
        find('[data-test-settings-form-input-image]').value,
        newSettings.image,
        'Settings image input should be different',
      );
      assert.notEqual(
        find('[data-test-settings-form-input-bio]').value,
        newSettings.bio,
        'Settings bio input should be different',
      );
      assert.notEqual(
        find('[data-test-settings-form-input-username]').value,
        newSettings.username,
        'Settings username input should be different',
      );
      assert.notEqual(
        find('[data-test-settings-form-input-password]').value,
        newSettings.password,
        'Settings password input should be different',
      );
      assert.notEqual(
        find('[data-test-settings-form-input-email]').value,
        newSettings.email,
        'Settings email input should be different',
      );

      const newSettingsEntries = Object.entries(newSettings);
      await all(
        newSettingsEntries.map(([key, value]) => {
          return fillIn(`[data-test-settings-form-input-${key}]`, value);
        }),
      );

      await click('[data-test-settings-form-button]');

      assert
        .dom('[data-test-settings-form-input-image]')
        .hasValue(newSettings.image, 'Settings image input should be updated');
      assert
        .dom('[data-test-settings-form-input-bio]')
        .hasValue(newSettings.bio, 'Settings bio input should be updated');
      assert
        .dom('[data-test-settings-form-input-username]')
        .hasValue(newSettings.username, 'Settings username input should be updated');
      assert
        .dom('[data-test-settings-form-input-password]')
        .hasValue(newSettings.password, 'Settings password input should be updated');
      assert
        .dom('[data-test-settings-form-input-email]')
        .hasValue(newSettings.email, 'Settings email input should be updated');
    });

    test('shows settings errors from server', async function (assert) {
      await visit('/settings');

      await fillIn('[data-test-settings-form-input-username]', Array(22).join('a'));
      await fillIn('[data-test-settings-form-input-email]', '');

      await click('[data-test-settings-form-button]');

      assert
        .dom('[data-test-settings-form-error-item]')
        .exists({ count: 2 }, 'Two errors are visible');
      assert
        .dom('[data-test-settings-form-error-item="0"]')
        .hasText('username is too long (maximum is 20 characters)');
      assert.dom('[data-test-settings-form-error-item="1"]').hasText("email can't be blank");
      assert.equal(
        currentRouteName(),
        'settings',
        'Should not navigate away from the page when there are errors',
      );
    });
  });
});
