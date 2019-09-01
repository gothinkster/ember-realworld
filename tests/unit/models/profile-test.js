import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import setupMirage from 'ember-cli-mirage/test-support/setup-mirage';

module('Unit | Model | profile', function(hooks) {
  setupTest(hooks);
  setupMirage(hooks);

  let store;
  hooks.beforeEach(function() {
    store = this.owner.lookup('service:store');
  });

  module('following', function() {
    test('#follow', async function(assert) {
      assert.expect(2);

      const mockProfile = server.create('profile', {
        following: false,
      });
      store.pushPayload({
        profile: {
          id: mockProfile.username,
          username: mockProfile.username,
          following: mockProfile.following,
        },
      });

      const profile = store.peekRecord('profile', mockProfile.username);

      assert.notOk(profile.following, 'The profile is not initially followed');
      await profile.follow();
      assert.ok(profile.following, 'The profile is then followed');
    });

    test('#unfollow', async function(assert) {
      assert.expect(2);

      const mockProfile = server.create('profile', {
        following: true,
      });
      store.pushPayload({
        profile: {
          id: mockProfile.username,
          username: mockProfile.username,
          following: mockProfile.following,
        },
      });

      const profile = store.peekRecord('profile', mockProfile.username);

      assert.ok(profile.following, 'The profile is initially followed');
      await profile.unfollow();
      assert.notOk(profile.following, 'The profile is then not followed');
    });
  });
});
