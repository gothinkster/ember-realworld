import { module } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { click, render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import test from 'ember-sinon-qunit/test-support/test';

module('Integration | Component | follow-user-button', function(hooks) {
  setupRenderingTest(hooks);

  test('`onClick` action is triggered from clicking the button', async function(assert) {
    assert.expect(1);

    const onClick = this.stub();

    this.set('onClick', onClick);

    // Template block usage:
    await render(hbs`
      {{follow-user-button onClick=onClick}}
    `);

    await click('[data-test-follow-author-button]');

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
      {{#follow-user-button class=classNames onClick=onClick}}
        template block text
      {{/follow-user-button}}
    `);

    const buttonAssertion = assert.dom('[data-test-follow-author-button]');

    buttonAssertion.hasClass('foo', 'Button `class` attribute should have `foo`');
    buttonAssertion.hasClass('bar', 'Button `class` attribute should have `bar`');
  });

});
