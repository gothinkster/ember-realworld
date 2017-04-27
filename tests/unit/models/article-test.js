import { moduleForModel, test } from 'ember-qunit';

moduleForModel('article', 'Unit | Model | article', {
  needs: ['model:user']
});

test('it exists', function(assert) {
  let model = this.subject();
  // let store = this.store();
  assert.ok(!!model);
});
