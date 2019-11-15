import { module } from 'qunit';
import { setupTest } from 'ember-qunit';
import test from 'ember-sinon-qunit/test-support/test';
import EmberObject from '@ember/object';
import window, { setupWindowMock } from 'ember-window-mock';

module('Unit | Route | settings', function(hooks) {
  setupTest(hooks);
  setupWindowMock(hooks);

  test('transitions anonymous users to `login` route', function(assert) {
    const route = this.owner.lookup('route:settings');
    const transitionToStub = this.stub(route, 'transitionTo');

    route.beforeModel();

    assert.ok(transitionToStub.calledOnceWith('login'), 'Should transition to `login` route');
  });

  module('`willTransition` action', function() {
    test('Confirms with user whether to transition when the user record has not been saved and has changes', async function(assert) {
      assert.expect(4);

      const route = this.owner.lookup('route:settings');
      const controller = EmberObject.create({
        session: EmberObject.create(),
      });
      const user = EmberObject.create({
        rollbackAttributes: this.stub(),
        hasDirtyAttributes: true,
      });
      const transition = {
        abort: this.stub(),
      };
      const confirmStub = this.stub(window, 'confirm').returns(true);

      route.set('controller', controller);
      controller.session.set('user', user);

      await route.actions.willTransition.call(route, transition);

      // When user wants to transition with changes, rollback.
      assert.ok(
        user.rollbackAttributes.calledOnce,
        'Should rollback attributes when user wants to transition without saving',
      );
      assert.notOk(
        transition.abort.called,
        'Transition abort should not be called when user wants to leave without saving',
      );

      user.rollbackAttributes.reset();
      transition.abort.reset();
      confirmStub.returns(false);
      await route.actions.willTransition.call(route, transition);

      // When user wants save changes, abort transition.

      assert.notOk(user.rollbackAttributes.called, 'Should not rollback attributes when user wants to save');
      assert.ok(transition.abort.calledOnce, 'Transition abort should be called when user wants to save');
    });

    test('Rolls back attributes when an user record does not have changed attributes', async function(assert) {
      assert.expect(2);

      const route = this.owner.lookup('route:settings');
      const controller = EmberObject.create({
        session: EmberObject.create(),
      });
      const user = EmberObject.create({
        rollbackAttributes: this.stub(),
        hasDirtyAttributes: false,
      });
      const transition = {
        abort: this.stub(),
      };
      const confirmStub = this.stub(window, 'confirm');

      route.set('controller', controller);
      controller.session.set('user', user);

      await route.actions.willTransition.call(route, transition);

      assert.ok(
        user.rollbackAttributes.calledOnce,
        'Should rollback attributes when there are no changes - will unload a new record from the store',
      );
      assert.notOk(confirmStub.called, 'User confirmation should not have been initiated when there are no changes.');
    });
  });
});
