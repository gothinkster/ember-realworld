import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import setupMirage from 'ember-cli-mirage/test-support/setup-mirage';
import { setupLoggedInUser, setupLoggedOutUser } from 'realworld-ember/tests/helpers/user';

const STORAGE_KEY = 'realworld.ember-classic.token';

module('Unit | Service | session', function(hooks) {
  setupTest(hooks);
  setupMirage(hooks);

  module('logged out', function(hooks) {
    setupLoggedOutUser(hooks);

    test('#isLoggedIn', function(assert) {
      const service = this.owner.lookup('service:session');
      service.initSession();
      assert.notOk(service.isLoggedIn, '#isLoggedIn is false');
    });

    test('#logIn', async function(assert) {
      const mockUser = server.create('user', { email: 'bob@example.com', password: 'password123' });
      const service = this.owner.lookup('service:session');
      const user = await service.logIn(mockUser.email, mockUser.password);
      assert.equal(user.email, 'bob@example.com');
      assert.equal(user.token, 'auth-token');
      assert.equal(localStorage.getItem(STORAGE_KEY), 'auth-token', 'Token is set in localStorage correctly');
    });
  });

  module('logged in', function(hooks) {
    setupLoggedInUser(hooks, 'auth-token');

    test('#isLoggedIn', async function(assert) {
      server.create('user', { email: 'email@example.com' });
      const service = this.owner.lookup('service:session');
      await service.initSession();
      assert.ok(service.isLoggedIn, '#isLoggedIn is true');
    });

    test('#logOut', async function(assert) {
      const service = this.owner.lookup('service:session');
      await service.logOut();
      assert.equal(service.token, null);
      assert.notOk(localStorage.getItem(STORAGE_KEY), 'Token does not exist in localStorage');
    });
  });
});
