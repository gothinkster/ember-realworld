import { module } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import setupMirage from 'ember-cli-mirage/test-support/setup-mirage';
import test from 'ember-sinon-qunit/test-support/test';

module('Integration | Component | tag-list', function(hooks) {
  setupRenderingTest(hooks);
  setupMirage(hooks);

  test('it loads the tags', async function(assert) {
    assert.expect(2);

    const store = this.owner.lookup('service:store');
    const querySpy = this.spy(store, 'query');

    await render(hbs`{{tag-list}}`);

    assert.dom('[data-test-tag]').exists({ count: 7 }, 'All the tags appear');

    /**
     * Query for popular tags.
     * Using findAll would return a live array that would get populated with tags from articles, which may/may-not be popular tags.
     */
    assert.ok(querySpy.calledOnceWithExactly('tag', {}), 'Should use `store.query` for popular tags.');
  });
});
