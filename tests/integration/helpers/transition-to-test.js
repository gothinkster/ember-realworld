import { module } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { click, render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import test from 'ember-sinon-qunit/test-support/test';

module('Integration | Helper | transition-to', function(hooks) {
  setupRenderingTest(hooks);

  test('triggers a transition to a given route', async function(assert) {
    assert.expect(3);

    const router = this.owner.lookup('service:router');
    const transitionToStub = this.stub(router, 'transitionTo');

    await render(hbs`<button {{action (transition-to "route-without-model")}}>Button!</button>`);
    await click('button');

    await render(hbs`<button {{action (transition-to "route-with-model" "model")}}>Button!</button>`);
    await click('button');

    await render(
      hbs`<button {{action (transition-to "route-with-invocation-args") "invocation-args"}}>Button!</button>`,
    );
    await click('button');

    assert.ok(transitionToStub.calledWith('route-without-model'), 'Transition to route without a `model`');
    assert.ok(transitionToStub.calledWith('route-with-model', 'model'), 'Transition to a roue with a `model`');
    assert.ok(
      transitionToStub.calledWith('route-with-invocation-args', 'invocation-args'),
      'Transition to a roue with invocation-args',
    );
  });
});
