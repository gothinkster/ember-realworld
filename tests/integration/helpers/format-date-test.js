import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Helper | format-date', function(hooks) {
  setupRenderingTest(hooks);

  test('it correctly formats the date', async function(assert) {
    this.set('inputValue', '2019-03-27T17:41:33.076Z');

    await render(hbs`{{format-date inputValue}}`);

    assert.dom(this.element).hasText('March 27, 2019');
  });

  test('it handles invalid inputs', async function(assert) {
    this.set('inputValue', null);

    await render(hbs`{{format-date inputValue}}`);

    assert.dom(this.element).hasText('');
  });
});
