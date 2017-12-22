import Ember from 'ember';
import { test } from 'ember-qunit';
import 'realworld-ember/tests/helpers/has-attributes';

const { get } = Ember;

// modified from gist source for relationships
// source: https://gist.github.com/he9qi/b6354a81a0672dc63294
export function testForAttributes(name, expectedAttributes) {
  test(`should have attributes [${expectedAttributes.join(', ')}]`, function(assert) {
    assert.expect(1);
    let Model = this.store().modelFor(name);
    let actualAttributes = get(Model, 'attributes');

    assert.hasAttributes(actualAttributes, expectedAttributes);
  });
}
