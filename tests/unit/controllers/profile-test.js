import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import { defer } from 'rsvp';

module('Unit | Controller | profile', function(hooks) {
  setupTest(hooks);

  module('`followUser` task', function() {
    test('handles successful following of user by profile', async function(assert) {
      assert.expect(3);

      const controller = this.owner.lookup('controller:profile');
      const deferred = defer();
      const profile = {
        follow: () => {
          return deferred.promise;
        },
      };

      assert.notOk(
        controller.waitingForFollowing,
        '`waitingForFollowing` property should be `false` before executing the task',
      );

      const executedTask = controller.followUser.perform(profile);

      assert.ok(
        controller.waitingForFollowing,
        '`waitingForFollowing` property should be `true` when task is executed',
      );

      deferred.resolve();

      await executedTask;

      assert.notOk(
        controller.waitingForFollowing,
        '`waitingForFollowing` property should be set to `false` after the task completes',
      );
    });

    test('handles failure following of user by profile', async function(assert) {
      assert.expect(3);

      const controller = this.owner.lookup('controller:profile');
      const deferred = defer();
      const profile = {
        follow: () => {
          return deferred.promise;
        },
      };

      assert.notOk(
        controller.waitingForFollowing,
        '`waitingForFollowing` property should be `false` before executing the task',
      );

      const executedTask = controller.followUser.perform(profile);

      assert.ok(
        controller.waitingForFollowing,
        '`waitingForFollowing` property should be `true` when task is executed',
      );

      deferred.reject();

      try {
        await executedTask;
      } catch {
        assert.notOk(
          controller.waitingForFollowing,
          '`waitingForFollowing` property should be set to `false` after the task completes',
        );
      }
    });
  });

  module('`unFollowUser` task', function() {
    test('handles successful unfollowing of user by profile', async function(assert) {
      assert.expect(3);

      const controller = this.owner.lookup('controller:profile');
      const deferred = defer();
      const profile = {
        unfollow: () => {
          return deferred.promise;
        },
      };

      assert.notOk(
        controller.waitingForFollowing,
        '`waitingForFollowing` property should be `false` before executing the task',
      );

      const executedTask = controller.unFollowUser.perform(profile);

      assert.ok(
        controller.waitingForFollowing,
        '`waitingForFollowing` property should be `true` when task is executed',
      );

      deferred.resolve();

      await executedTask;

      assert.notOk(
        controller.waitingForFollowing,
        '`waitingForFollowing` property should be set to `false` after the task completes',
      );
    });

    test('handles failure unfollowing of user by profile', async function(assert) {
      assert.expect(3);

      const controller = this.owner.lookup('controller:profile');
      const deferred = defer();
      const profile = {
        unfollow: () => {
          return deferred.promise;
        },
      };

      assert.notOk(
        controller.waitingForFollowing,
        '`waitingForFollowing` property should be `false` before executing the task',
      );

      const executedTask = controller.unFollowUser.perform(profile);

      assert.ok(
        controller.waitingForFollowing,
        '`waitingForFollowing` property should be `true` when task is executed',
      );

      deferred.reject();

      try {
        await executedTask;
      } catch {
        assert.notOk(
          controller.waitingForFollowing,
          '`waitingForFollowing` property should be set to `false` after the task completes',
        );
      }
    });
  });
});
