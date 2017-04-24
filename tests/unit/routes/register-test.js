import { moduleFor, test } from 'ember-qunit';

moduleFor('route:register', 'Unit | Route | register', {
  needs: ['service:session']
});

test('it exists', function(assert) {
  let route = this.subject();
  assert.ok(route);
});
