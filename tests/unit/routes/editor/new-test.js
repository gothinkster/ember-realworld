import { module } from 'qunit';
import { setupTest } from 'ember-qunit';
import test from 'ember-sinon-qunit/test-support/test';
import window from 'ember-window-mock';
import EmberObject from '@ember/object';

module('Unit | Route | editor/new', function(hooks) {
  setupTest(hooks);

  test('`beforeModel` method transitions to `login` route if the user is anonymous', function(assert) {
    assert.expect(2);

    const route = this.owner.lookup('route:editor/new');
    const transitionToStub = this.stub(route, 'transitionTo');

    route.session.set('token', true);
    route.beforeModel();

    assert.notOk(transitionToStub.called, 'Transition should not have occurred when user is logged in');

    route.session.set('token', false);
    route.beforeModel();

    assert.ok(
      transitionToStub.calledOnceWith('login'),
      'Transition to `login` route have occurred when user is anonymous',
    );
  });

  test('`model` method returns a new article record', function(assert) {
    assert.expect(1);

    const route = this.owner.lookup('route:editor/new');
    const createRecordStub = this.stub(route.store, 'createRecord');

    route.model();

    assert.ok(createRecordStub.calledOnceWith('article'), 'Create an article record');
  });

  module('`willTransition` action', function() {
    test('Confirms with user whether to transition when the article record has not been saved and has changes', async function(assert) {
      assert.expect(4);

      const route = this.owner.lookup('route:editor/new');
      const controller = EmberObject.create();
      const draftArticle = {
        rollbackAttributes: this.stub(),
        hasDirtyAttributes: true,
      };
      const transition = {
        abort: this.stub(),
      };
      const confirmStub = this.stub(window, 'confirm').returns(true);

      route.set('controller', controller);
      controller.set('draftArticle', draftArticle);

      await route.actions.willTransition.call(route, transition);

      // When user wants to transition with changes, rollback.
      assert.ok(
        draftArticle.rollbackAttributes.calledOnce,
        'Should rollback attributes when user wants to transition without saving',
      );
      assert.notOk(
        transition.abort.called,
        'Transition abort should not be called when user wants to leave without saving',
      );

      draftArticle.rollbackAttributes.reset();
      transition.abort.reset();
      confirmStub.returns(false);
      await route.actions.willTransition.call(route, transition);

      // When user wants save changes, abort transition.

      assert.notOk(draftArticle.rollbackAttributes.called, 'Should not rollback attributes when user wants to save');
      assert.ok(transition.abort.calledOnce, 'Transition abort should be called when user wants to save');
    });

    test('Rolls back attributes when an article record does not have changed attributes', async function(assert) {
      assert.expect(2);

      const route = this.owner.lookup('route:editor/new');
      const controller = EmberObject.create();
      const draftArticle = {
        rollbackAttributes: this.stub(),
        hasDirtyAttributes: false,
      };
      const transition = {
        abort: this.stub(),
      };
      const confirmStub = this.stub(window, 'confirm');

      route.set('controller', controller);
      controller.set('draftArticle', draftArticle);

      await route.actions.willTransition.call(route, transition);

      assert.ok(
        draftArticle.rollbackAttributes.calledOnce,
        'Should rollback attributes when there are no changes - will unload a new record from the store',
      );
      assert.notOk(confirmStub.called, 'User confirmation should not have been initiated when there are no changes.');
    });
  });
});
