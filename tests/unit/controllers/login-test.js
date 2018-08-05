import { moduleFor, test } from 'ember-qunit';

moduleFor('controller:login', 'Unit | Controller | login', {
  needs: ['service:session']
});

// Replace this with your real tests.
test('it exists', function(assert) {
  const controller = this.subject();
  assert.ok(controller);
});
