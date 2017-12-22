import Ember from 'ember';
import { test } from 'ember-qunit';

const { get } = Ember;

function runAssertions(assert, store, modelName, relationshipName, relationshipKind) {
  assert.expect(2);

  let Model = store.modelFor(modelName);
  let relationship = get(Model, 'relationshipsByName').get(relationshipName);

  assert.ok(relationship, `Expected ${modelName} model to have a relationship with ${relationshipName}, but none was found.`);
  assert.equal(relationship.kind, relationshipKind, `Expected relationship kind to be ${relationshipKind}, but got ${relationship.kind}`);
}

// source: https://gist.github.com/he9qi/b6354a81a0672dc63294
export function testForHasMany(name, many) {
  test(`should have many ${many}`, function(assert) {
    runAssertions(assert, this.store(), name, many, 'hasMany');
  });
}

export function testForBelongsTo(name, belongsTo) {
  test(`should belong to ${belongsTo}`, function(assert) {
    runAssertions(assert, this.store(), name, belongsTo, 'belongsTo');
  });
}
