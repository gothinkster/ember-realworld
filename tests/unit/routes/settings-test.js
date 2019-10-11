import { module } from 'qunit';
import { setupTest } from 'ember-qunit';
import test from 'ember-sinon-qunit/test-support/test';

module('Unit | Route | settings', function(hooks) {
  setupTest(hooks);

  test('transitions anonymous users to `login` route', function(assert) {
    const route = this.owner.lookup('route:settings');
    const transitionToStub = this.stub(route, 'transitionTo');

    route.beforeModel();

    assert.ok(transitionToStub.calledOnceWith('login'), 'Should transition to `login` route');
  });
});
