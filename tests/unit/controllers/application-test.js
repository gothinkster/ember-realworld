import { moduleFor, test } from 'ember-qunit';

moduleFor('controller:application', 'Unit | Controller | application', {
  needs: ['service:session']
});

// Replace this with your real tests.
test('it exists', function(assert) {
  let controller = this.subject();
  assert.ok(controller);
});
