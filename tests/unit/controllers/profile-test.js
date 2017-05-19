import { moduleFor, test } from 'ember-qunit';

moduleFor('controller:profile', 'Unit | Controller | profile', {
  needs: ['service:session', 'service:profiles']
});

// Replace this with your real tests.
test('it exists', function(assert) {
  let controller = this.subject();
  assert.ok(controller);
});
