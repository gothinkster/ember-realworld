import { module, test } from 'qunit';
import { visit, currentURL, fillIn, triggerKeyEvent, click, currentRouteName } from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';
import setupMirage from 'ember-cli-mirage/test-support/setup-mirage';
import { setupLoggedOutUser, setupLoggedInUser } from '../../helpers/user';

module('Acceptance | editor/new', function(hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);

  module('anonymous user', function(hooks) {
    setupLoggedOutUser(hooks);

    test('is transitioned to login', async function(assert) {
      await visit('/editor');

      assert.equal(currentURL(), '/login');
    });
  });

  module('logged-in user', function(hooks) {
    setupLoggedInUser(hooks);

    hooks.beforeEach(function() {
      server.create('user', {
        email: 'bob@example.com',
        password: 'password123',
      });
    });

    test('can create an article', async function(assert) {
      await visit('/editor');

      await fillIn('[data-test-article-form-input-title]', 'Test Title');
      await fillIn('[data-test-article-form-input-description]', 'Test Description');
      await fillIn('[data-test-article-form-input-body]', 'Test Body');
      /**
       * Add a tag via input.
       */
      await fillIn('[data-test-article-form-input-tags]', 'test-tag');
      await triggerKeyEvent('[data-test-article-form-input-tags]', 'keydown', 'Enter');
      await click('[data-test-article-form-submit-button]');

      assert.equal(currentRouteName(), 'article');
    });

    test('shows article errors from server', async function(assert) {
      await visit('/editor');

      await fillIn('[data-test-article-form-input-title]', Array(202).join('a'));
      await fillIn('[data-test-article-form-input-description]', Array(502).join('a'));
      await fillIn('[data-test-article-form-input-body]', 'Test Body');
      await click('[data-test-article-form-submit-button]');

      assert.dom('[data-test-article-form-error-item]').exists();
      assert.equal(currentRouteName(), 'editor.new', 'Should not navigate away from the page when there are errors');
    });
  });
});
