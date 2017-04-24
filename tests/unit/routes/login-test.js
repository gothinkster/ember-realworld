import { moduleFor, test } from 'ember-qunit';

moduleFor('route:login', 'Unit | Route | login', {
  needs: ['service:session']
});

test('it exists', function(assert) {
  let route = this.subject();
  assert.ok(route);
});
