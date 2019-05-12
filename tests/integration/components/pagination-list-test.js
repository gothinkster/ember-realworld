import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | pagination-list', function(hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function(assert) {
    const template = hbs`{{pagination-list
      current=current
      total=total
      pageSize=pageSize
      existingParams=existingParams
    }}`;
    this.setProperties({
      current: 2,
      total: 130,
      pageSize: 10,
      existingParams: {},
    });
    await render(template);

    assert.dom('[data-test-page-item-link]').exists({ count: 13 }, 'The correct number of pages are shown');
    assert.dom('[data-test-page-item].active').hasText('2', 'The correct page is selected');
  });
});
