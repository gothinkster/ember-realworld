import { module, test } from 'qunit';
import {
  visit,
  currentURL,
  fillIn,
  click,
  triggerKeyEvent,
  currentRouteName,
} from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';
import setupMirage from 'ember-cli-mirage/test-support/setup-mirage';
import { setupLoggedOutUser, setupLoggedInUser } from '../../helpers/user';
import sinon from 'sinon';

module('Acceptance | editor/edit', function (hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);

  hooks.before(function () {
    sinon.stub(window, 'confirm');
  });

  hooks.after(function () {
    sinon.restore();
  });

  module('anonymous user', function (hooks) {
    setupLoggedOutUser(hooks);

    test('is transitioned to login', async function (assert) {
      await visit('/editor/foo');

      assert.equal(currentURL(), '/login');
    });
  });

  module('logged-in user', function (hooks) {
    setupLoggedInUser(hooks);

    let user;
    let userProfile;
    let article;

    hooks.beforeEach(function () {
      user = this.server.create('user');
      userProfile = this.server.schema.profiles.findBy({ username: user.username });
      article = this.server.create('article', {
        author: userProfile,
      });
    });

    test('can edit their own article', async function (assert) {
      await visit(`/editor/${article.slug}`);
      await fillIn('[data-test-article-form-input-title]', 'Test Title');
      await fillIn('[data-test-article-form-input-description]', 'Test Description');
      await fillIn('[data-test-article-form-input-body]', 'Test Body');

      await fillIn('[data-test-article-form-input-tags]', 'test-tag');
      await triggerKeyEvent('[data-test-article-form-input-tags]', 'keydown', 'Enter');
      await click('[data-test-article-form-submit-button]');

      assert.equal(currentRouteName(), 'articles.article');
      assert.dom('[data-test-article-title]').hasText('Test Title');
      assert.dom('[data-test-article-body]').hasText('Test Body');
    });

    test('shows article errors from server', async function (assert) {
      await visit(`/editor/${article.slug}`);

      await fillIn('[data-test-article-form-input-title]', 'Test Title');
      await fillIn('[data-test-article-form-input-description]', 'Test Description');
      await fillIn('[data-test-article-form-input-body]', '');
      await click('[data-test-article-form-submit-button]');

      assert
        .dom('[data-test-article-form-error-item]')
        .exists({ count: 1 }, 'A single error exists');
      assert.dom('[data-test-article-form-error-item]').hasText("body can't be blank");
      assert.equal(
        currentRouteName(),
        'editor.edit',
        'Should not navigate away from the page when there are errors',
      );
    });
  });
});
