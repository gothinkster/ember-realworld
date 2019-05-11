import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import setupMirage from 'ember-cli-mirage/test-support/setup-mirage';

module('Integration | Component | tag-list', function(hooks) {
  setupRenderingTest(hooks);
  setupMirage(hooks);

  test('it loads the tags', async function(assert) {
    await render(hbs`{{tag-list}}`);
    assert.dom('[data-test-tag]').exists({ count: 7 }, 'All the tags appear');
  });
});
