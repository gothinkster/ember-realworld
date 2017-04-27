import { moduleFor, test } from 'ember-qunit';

moduleFor('controller:home', 'Unit | Controller | home', {
  needs: ['service:session']
});

// Replace this with your real tests.
test('it exists', function(assert) {
  let controller = this.subject();
  assert.ok(controller);
});
