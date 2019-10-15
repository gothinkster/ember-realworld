import { module, test } from 'qunit';
import { find, fillIn, visit, currentURL, click, settled, currentRouteName } from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';
import setupMirage from 'ember-cli-mirage/test-support/setup-mirage';
import { setupLoggedInUser, setupLoggedOutUser } from '../helpers/user';
import { all } from 'rsvp';

module('Acceptance | settings', function(hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);
  setupLoggedOutUser(hooks);

  test('visiting /settings redirects to login', async function(assert) {
    await visit('/settings');

    assert.equal(currentURL(), '/login');
  });

  module('logged-in user', function(hooks) {
    setupLoggedInUser(hooks, 'token');

    let user;

    hooks.beforeEach(function() {
      user = server.create('user', {
        email: 'bob@example.com',
        password: 'password123',
      });

      server.get('/user', schema => {
        return schema.users.first();
      });
    });

    test('can edit their settings', async function(assert) {
      assert.expect(10);

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
      assert
        .dom('[data-test-settings-form-input-password]')
        .hasValue('', 'Settings password input should start as an empty string');
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

      await click('[data-test-settings-form-submit-button]');
      await settled();

      user.reload();

      newSettingsEntries.forEach(([key, value]) => {
        assert.equal(user[key], value, `Expected user ${key} to be updated`);
      });
    });

    test('shows settings errors from server', async function(assert) {
      assert.expect(2);

      await visit('/settings');

      await fillIn('[data-test-settings-form-input-username]', Array(22).join('a'));
      await fillIn('[data-test-settings-form-input-email]', '');

      await click('[data-test-settings-form-submit-button]');

      assert.dom('[data-test-settings-form-error-item]').exists();
      assert.equal(currentRouteName(), 'settings', 'Should not navigate away from the page when there are errors');
    });
  });
});
