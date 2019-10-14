import { module } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { click, render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import test from 'ember-sinon-qunit/test-support/test';

module('Integration | Component | favorite-article-button', function(hooks) {
  setupRenderingTest(hooks);

  test('`onClick` action is triggered from clicking the button', async function(assert) {
    assert.expect(1);

    const onClick = this.stub();

    this.set('onClick', onClick);

    // Template block usage:
    await render(hbs`
      {{#favorite-article-button onClick=onClick}}
        template block text
      {{/favorite-article-button}}
    `);

    await click('[data-test-favorite-article-button]');

    assert.ok(onClick.calledOnce, 'Clicking on button should trigger `onClick` action');
  });

  test('`class` arg is appended to button `class` attribute', async function(assert) {
    assert.expect(2);

    const classNames = 'foo bar';
    const onClick = () => {};

    this.setProperties({
      classNames,
      onClick,
    });

    // Template block usage:
    await render(hbs`
      {{#favorite-article-button class=classNames onClick=onClick}}
        template block text
      {{/favorite-article-button}}
    `);

    const buttonAssertion = assert.dom('[data-test-favorite-article-button]');

    buttonAssertion.hasClass('foo', 'Button `class` attribute should have `foo`');
    buttonAssertion.hasClass('bar', 'Button `class` attribute should have `bar`');
  });
});
