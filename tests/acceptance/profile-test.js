import { module, test } from 'qunit';
import { visit, currentURL, click, settled } from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';
import setupMirage from 'ember-cli-mirage/test-support/setup-mirage';
import { setupLoggedInUser, setupLoggedOutUser } from '../helpers/user';

module('Acceptance | profile', function (hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);

  module('logged out user', function (hooks) {
    setupLoggedOutUser(hooks);

    test('visiting /profile/username', async function (assert) {
      const profileOwner = this.server.create('profile');
      await visit(`/profile/${profileOwner.username}`);

      assert
        .dom('[data-test-edit-profile-button]')
        .doesNotExist('A logged-out user does not show the edit profile button');
    });

    test('visiting any user profile will see a link to follow the profile owner but links to login', async function (assert) {
      const profileOwner = this.server.create('profile');

      await visit(`/profile/${profileOwner.username}`);
      await click('[data-test-follow-author-button]');

      assert.equal(currentURL(), '/login');
    });

    test('sees a tab navigation to articles written by and favorited by the profile owner', async function (assert) {
      const profileOwner = this.server.create('profile');
      const otherUser = this.server.create('profile');

      /**
       * Articles written by profile owner.
       */
      this.server.createList('article', 2, {
        author: profileOwner,
        favorited: false,
      });
      /**
       * Articles favorited by profile owner, not written by profile owner.
       */
      this.server.createList('article', 3, {
        author: otherUser,
        favorited: true,
      });

      await visit(`/profile/${profileOwner.username}`);
      await click('[data-test-profile-tab="favorite-articles"]');

      assert.equal(currentURL(), `/profile/${profileOwner.username}/favorites`);
      assert
        .dom('[data-test-article-title]')
        .exists({ count: 3 }, 'Expected a list of 3 articles favorited by profile owner');

      await click('[data-test-profile-tab="my-articles"]');
      assert
        .dom('[data-test-article-title]')
        .exists({ count: 2 }, 'Expected a list of 2 articles created by profile owner');
      assert.equal(currentURL(), `/profile/${profileOwner.username}`);
    });

    test("clicking on an article's favorite button redirects user to login page", async function (assert) {
      const profileOwner = this.server.create('profile');
      /**
       * Articles written by profile owner.
       */
      this.server.create('article', 1, {
        author: profileOwner,
        favorited: false,
      });

      await visit(`/profile/${profileOwner.username}`);
      await click('[data-test-favorite-article-button]');
      assert.equal(currentURL(), '/login');
    });
  });

  module('logged in user', function (hooks) {
    setupLoggedInUser(hooks, 'token');

    let user;

    hooks.beforeEach(function () {
      user = this.server.create('user', {
        email: 'bob@example.com',
        password: 'password123',
      });
      this.server.get('/user', (schema) => {
        return schema.users.first();
      });
    });

    test('visiting their own profile sees a link to edit profile', async function (assert) {
      assert.expect(1);

      await visit(`/profile/${user.username}`);
      await click('[data-test-edit-profile-button]');

      assert.equal(currentURL(), `/settings`);
    });

    test('visiting another user profile sees a link to follow the profile owner', async function (assert) {
      const otherUser = this.server.create('profile', { following: false });

      await visit(`/profile/${otherUser.username}`);
      assert
        .dom('[data-test-follow-author-button]')
        .includesText(`Follow ${otherUser.username}`, 'The profile is initially unfollowed');

      await click('[data-test-follow-author-button]');
      // eslint-disable-next-line ember/no-settled-after-test-helper
      await settled();

      assert
        .dom('[data-test-follow-author-button]')
        .includesText(`Unfollow ${otherUser.username}`, 'The profile is followed');

      await click('[data-test-follow-author-button]');
      // eslint-disable-next-line ember/no-settled-after-test-helper
      await settled();

      assert
        .dom('[data-test-follow-author-button]')
        .includesText(`Follow ${otherUser.username}`, 'The profile is unfollowed');
    });

    test('favorite an article by the user', async function (assert) {
      const profileOwner = this.server.create('profile');
      this.server.create('article', 1, {
        author: profileOwner,
        favorited: false,
      });

      await visit(`/profile/${profileOwner.username}`);
      await click('[data-test-favorite-article-button]');
      // eslint-disable-next-line ember/no-settled-after-test-helper
      await settled();

      assert
        .dom('[data-test-favorite-article-button="favorited"]')
        .exists('Article should be favorited');
    });
  });
});
