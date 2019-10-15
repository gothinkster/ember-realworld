import { module } from 'qunit';
import { setupTest } from 'ember-qunit';
import test from 'ember-sinon-qunit/test-support/test';
import EmberObject from '@ember/object';

module('Unit | Controller | settings', function(hooks) {
  setupTest(hooks);

  // Replace this with your real tests.
  test('it exists', function(assert) {
    const controller = this.owner.lookup('controller:settings');
    assert.ok(controller);
  });

  test('`signOut` action logs the user out and transitions them to the `index` route', function(assert) {
    assert.expect(2);

    const controller = this.owner.lookup('controller:settings');
    const logOutStub = this.stub(controller.session, 'logOut');
    const transitionToRouteStub = this.stub(controller, 'transitionToRoute');

    controller.actions.signOut.call(controller);

    assert.ok(logOutStub.calledOnce, 'Expect `session.logOut` to be executed in order to log the user out');
    assert.ok(
      transitionToRouteStub.calledOnceWith('index'),
      'Expect to transition to `index` route after user is logged out',
    );
  });

  test('`saveSettings` action saves users new settings and transitions to their user profile', async function(assert) {
    assert.expect(7);

    const controller = this.owner.lookup('controller:settings');
    const settings = {
      image: 'image',
      username: 'username',
      bio: 'bio',
      email: 'email',
      password: 'password',
    };
    const user = EmberObject.create({
      save: this.stub().resolves(),
    });
    const transitionToRouteStub = this.stub(controller, 'transitionToRoute');

    await controller.actions.saveSettings.call(controller, user, settings);

    assert.equal(user.image, settings.image, 'Expect `image` to be set on the `user` record');
    assert.equal(user.username, settings.username, 'Expect `username` to be set on the `user` record');
    assert.equal(user.bio, settings.bio, 'Expect `bio` to be set on the `user` record');
    assert.equal(user.email, settings.email, 'Expect `email` to be set on the `user` record');
    assert.equal(user.password, settings.password, 'Expect `password` to be set on the `user` record');
    assert.ok(user.save.calledOnce, 'Expect to execute `user.save` to save the changes');
    assert.ok(
      transitionToRouteStub.calledOnceWith('profile', settings.username),
      'Expect to transition to `profile` route successfully saving changes',
    );
  });

  test('`changeAttr` action sets a the value for a key on the `user` record', function(assert) {
    assert.expect(2);

    const controller = this.owner.lookup('controller:settings');
    const user = EmberObject.create({ foo: 'foo' });

    assert.equal(user.foo, 'foo', 'Expect a key/value to be unchanged before executing `changeAttr` action');

    controller.actions.changeAttr.call(controller, user, 'foo', 'bar');

    assert.equal(user.foo, 'bar', 'Expect a key/value to be changed when `changeAttr` action is executed');
  });
});
