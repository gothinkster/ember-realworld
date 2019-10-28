import { module } from 'qunit';
import { setupTest } from 'ember-qunit';
import test from 'ember-sinon-qunit/test-support/test';
import EmberObject from '@ember/object';
import { DraftArticle } from 'realworld-ember/controllers/editor/new';

module('Unit | Controller | editor/new', function(hooks) {
  setupTest(hooks);

  test('`draftArticle` computed property returns an instance of `DraftArticle` class', async function(assert) {
    assert.expect(1);

    const controller = this.owner.lookup('controller:editor/new');
    const { draftArticle } = controller;

    assert.ok(draftArticle instanceof DraftArticle, 'Should be an instance of `DraftArticle` class');
  });

  test('`isValid` computed property returns a boolean, validating the dependent properties', function(assert) {
    const controller = this.owner.lookup('controller:editor/new');
    /**
     * Set the model, which draftArticle uses to access initialState.
     */
    controller.set('model', EmberObject.create());

    const { draftArticle } = controller;

    assert.notOk(
      controller.isValid,
      '`isValid` should be false when `draftArticle` properties `title`, `description`, and `body` are empty',
    );

    draftArticle.set('title', 'title!');
    draftArticle.set('description', 'description!');

    assert.notOk(controller.isValid, '`isValid` should be false when `draftArticle.body` is empty');

    draftArticle.set('body', 'body!');

    assert.ok(
      controller.isValid,
      '`isValid` should be true when `draftArticle` properties `title`, `description`, and `body` is not empty',
    );
  });

  test('`saveArticle` action sets properties on the model and saves the changes', async function(assert) {
    assert.expect(4);

    const controller = this.owner.lookup('controller:editor/new');
    const model = EmberObject.create({
      save: this.stub().resolves(),
    });
    /**
     * Set the model, which draftArticle uses to access initialState.
     */
    controller.set('model', model);

    const { draftArticle } = controller;
    const resetInitialStateStub = this.stub(draftArticle, 'resetInitialState');
    const transitionToRouteStub = this.stub(controller, 'transitionToRoute');

    const title = 'title!';

    await controller.actions.saveArticle.call(controller, draftArticle, { title });

    assert.equal(draftArticle.title, title, 'Should set the title on the draft article');
    assert.ok(model.save.calledOnce, 'Should have saved the article changes');
    assert.ok(
      resetInitialStateStub.calledOnce,
      'Draft article initial state should reset because the article has the saved the change from the draft article',
    );
    assert.ok(
      transitionToRouteStub.calledOnceWith('article', model),
      'Should transition to the route of the saved article',
    );
  });

  test('`changeAttr` action', function(assert) {
    assert.expect(1);

    const controller = this.owner.lookup('controller:editor/new');
    const model = EmberObject.create();

    controller.set('model', model);

    const { draftArticle } = controller;
    const key = 'title';
    const value = 'title!';

    controller.actions.changeAttr.call(controller, draftArticle, key, value);

    assert.equal(draftArticle.title, value, 'Should set the key/value on the draftArticle');
  });
});

module('`Unit | Controller | editor/new | Class | DraftArticle', function() {
  test('`initialState` computed property', function(assert) {
    assert.expect(2);

    const draftArticle = DraftArticle.create();
    const { initialState } = draftArticle;

    draftArticle.set('initialState', {});

    assert.ok(typeof initialState === 'object', 'Should return an object by default');
    assert.notEqual(initialState, draftArticle.initialState, 'Should support setting different value');
  });

  test('`hasDirtyAttributes` computed property checks properties against `initialState` for dirty attibutes', async function(assert) {
    assert.expect(3);

    const model = EmberObject.create({ title: 'old title!' });
    const draftArticle = DraftArticle.create({ model });

    assert.equal(draftArticle.title, draftArticle.initialState.title, 'Initial state of title should be as expected');
    assert.notOk(draftArticle.hasDirtyAttributes, 'Should return false when there are no changes');

    /**
     * Set the new title.
     */
    draftArticle.set('title', 'new title!');

    assert.ok(draftArticle.hasDirtyAttributes, ' Should return true when there are changes');
  });

  test('`rollbackAttributes` method reverts changed state and executes `model.rollbackAttributes` method to ensure changes are rolled back on the model', function(assert) {
    assert.expect(3);

    const model = EmberObject.create({
      title: 'old title!',
      rollbackAttributes: this.stub(),
    });
    const draftArticle = DraftArticle.create({ model });

    assert.equal(draftArticle.title, draftArticle.initialState.title, 'Initial state of title should be as expected');

    /**
     * Set the new title.
     */
    draftArticle.set('title', 'new title!');

    assert.notEqual(
      draftArticle.title,
      draftArticle.initialState.title,
      'Should have changed the title before testing `rollbackAttributes` method`',
    );

    draftArticle.rollbackAttributes();

    assert.equal(
      draftArticle.title,
      draftArticle.initialState.title,
      'Changed `title` should have rolled back to what it was in the initial state',
    );
  });

  test('`resetInitialState` method sets a new object as the value of `initialState`', function(assert) {
    assert.expect(1);

    const draftArticle = DraftArticle.create();
    const { initialState } = draftArticle;

    draftArticle.resetInitialState();

    assert.notEqual(initialState, draftArticle.initialState, 'Initial state should be a different object');
  });
});
