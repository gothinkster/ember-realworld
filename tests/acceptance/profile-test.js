import { module, test } from 'qunit';
import { visit, currentURL, click, settled } from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';
import setupMirage from 'ember-cli-mirage/test-support/setup-mirage';
import { setupLoggedInUser, setupLoggedOutUser } from '../helpers/user';

module('Acceptance | profile', function(hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);
  setupLoggedOutUser(hooks);

  test('visiting /profile', async function(assert) {
    await visit('/profile');

    assert.equal(currentURL(), '/profile');
  });

  test('visiting any user profile will see a link to follow the profile owner but links to login', async function(assert) {
    assert.expect(1);

    const profileOwner = server.create('profile');

    await visit(`/profile/${profileOwner.username}`);
    await click('[data-test-follow-profile-button]');

    assert.equal(currentURL(), '/login');
  });

  test('sees a tab navigation to articles written by and favorited by the profile owner', async function(assert) {
    assert.expect(3);

    const profileOwner = server.create('profile');
    const otherUser = server.create('profile');

    /**
     * Articles written by profile owner.
     */
    server.createList('article', 2, {
      author: profileOwner,
      favorited: false,
    });
    /**
     * Articles favorited by profile owner, not written by profile owner.
     */
    server.createList('article', 3, {
      author: otherUser,
      favorited: true,
    });

    await visit(`/profile/${profileOwner.username}`);
    await click('[data-test-profile-nav-link="favorite-articles"]');

    assert.equal(currentURL(), `/profile/${profileOwner.username}/favorites`);
    assert
      .dom('[data-test-article-title]')
      .exists({ count: 3 }, 'Expected a list of 3 articles favorited by profile owner');

    await click('[data-test-profile-nav-link="my-articles"]');
    assert
      .dom('[data-test-article-title]')
      .exists({ count: 2 }, 'Expected a list of 2 articles created by profile owner');
  });

  test("clicking on an article's favorite button redirects user to login page", async function(assert) {
    assert.expect(1);

    const profileOwner = server.create('profile');
    /**
     * Articles written by profile owner.
     */
    server.create('article', 1, {
      author: profileOwner,
      favorited: false,
    });

    await visit(`/profile/${profileOwner.username}`);

    await click('[data-test-favorite-article-button-login]');

    assert.equal(currentURL(), '/login');
  });

  module('logged in user', function(hooks) {
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

    test('visiting their own profile sees a link to edit profile', async function(assert) {
      assert.expect(1);

      await visit(`/profile/${user.username}`);
      await click('[data-test-edit-profile-button]');

      assert.equal(currentURL(), `/settings`);
    });

    test('visiting another user profile sees a link to follow the profile owner', async function(assert) {
      const otherUser = server.create('profile', { following: false });

      await visit(`/profile/${otherUser.username}`);
      await click('[data-test-follow-profile-button]');
      await settled();

      otherUser.reload();
      assert.ok(otherUser.following, 'Clicking on follow button should follow the profile owner');

      await click('[data-test-follow-profile-button]');
      await settled();

      otherUser.reload();
      assert.notOk(otherUser.following, 'Clicking on unfollow button should unfollow the profile owner');
    });

    test('favorite an article by the user', async function(assert) {
      assert.expect(1);

      const profileOwner = server.create('profile');
      /**
       * Articles written by profile owner.
       */
      const article = server.create('article', 1, {
        author: profileOwner,
        favorited: false,
      });

      await visit(`/profile/${profileOwner.username}`);

      await click('[data-test-favorite-article-button]');

      assert.ok(article.favorited, 'Article should be favorited');
    });
  });
});
