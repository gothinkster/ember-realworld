import { test } from 'qunit';
import testSelector from 'ember-test-selectors';
import moduleForAcceptance from 'realworld-ember/tests/helpers/module-for-acceptance';

moduleForAcceptance('Acceptance | login');

test('visiting /login', function(assert) {
  let user = server.create('user', { email: 'bob@example.com', password: 'password123' });

  visit('/login');

  fillIn(testSelector('email'), user.email);
  fillIn(testSelector('password'), user.password);

  andThen(function() {
    assert.equal(currentURL(), '/home');
  });
});
