import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Helper | eq', function(hooks) {
  setupRenderingTest(hooks);

  // Replace this with your real tests.
  test('it checks two values for strict equality', async function(assert) {
    this.set('inputValueA', '1234');
    this.set('inputValueB', '1234');

    await render(hbs`{{eq inputValueA inputValueB}}`);
    assert.dom(this.element).hasText('true');

    this.set('inputValueB', '123');
    await render(hbs`{{eq inputValueA inputValueB}}`);
    assert.dom(this.element).hasText('false');
  });
});
