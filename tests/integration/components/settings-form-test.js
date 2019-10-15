import { module } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { click, fillIn, render, settled } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import test from 'ember-sinon-qunit/test-support/test';
import sinon from 'sinon';

module('Integration | Component | settings-form', function(hooks) {
  setupRenderingTest(hooks);

  test('image input triggers change action', async function(assert) {
    assert.expect(2);

    const onChange = this.spy();

    this.set('onChange', onChange);

    await render(hbs`{{settings-form image="image?" onChange=onChange}}`);

    assert.dom('[data-test-settings-form-input-image]').hasValue('image?');

    await fillIn('[data-test-settings-form-input-image]', 'image!!!');

    assert.ok(onChange.calledOnceWith('image', 'image!!!'), '`onChange` to be called with expected properties');
  });

  test('username input triggers change action', async function(assert) {
    assert.expect(2);

    const onChange = this.spy();

    this.set('onChange', onChange);

    await render(hbs`{{settings-form username="username?" onChange=onChange}}`);

    assert.dom('[data-test-settings-form-input-username]').hasValue('username?');

    await fillIn('[data-test-settings-form-input-username]', 'username!!!');

    assert.ok(onChange.calledOnceWith('username', 'username!!!'), '`onChange` to be called with expected properties');
  });

  test('bio input triggers change action', async function(assert) {
    assert.expect(2);

    const onChange = this.spy();

    this.set('onChange', onChange);

    await render(hbs`{{settings-form bio="bio?" onChange=onChange}}`);

    assert.dom('[data-test-settings-form-input-bio]').hasValue('bio?');

    await fillIn('[data-test-settings-form-input-bio]', 'bio!!!');

    assert.ok(onChange.calledOnceWith('bio', 'bio!!!'), '`onChange` to be called with expected properties');
  });

  test('email input triggers change action', async function(assert) {
    assert.expect(2);

    const onChange = this.spy();

    this.set('onChange', onChange);

    await render(hbs`{{settings-form email="email?" onChange=onChange}}`);

    assert.dom('[data-test-settings-form-input-email]').hasValue('email?');

    await fillIn('[data-test-settings-form-input-email]', 'email!!!');

    assert.ok(onChange.calledOnceWith('email', 'email!!!'), '`onChange` to be called with expected properties');
  });

  test('password input triggers change action', async function(assert) {
    assert.expect(2);

    const onChange = this.spy();

    this.set('onChange', onChange);

    await render(hbs`{{settings-form password="password?" onChange=onChange}}`);

    assert.dom('[data-test-settings-form-input-password]').hasValue('password?');

    await fillIn('[data-test-settings-form-input-password]', 'password!!!');

    assert.ok(onChange.calledOnceWith('password', 'password!!!'), '`onChange` to be called with expected properties');
  });

  test('`submit` button triggers `submit` action', async function(assert) {
    assert.expect(4);

    const onSubmit = this.spy();
    this.set('onSubmit', onSubmit);
    this.set('disableSubmit', true);

    await render(hbs`{{settings-form onSubmit=onSubmit disableSubmit=disableSubmit}}`);

    assert
      .dom('[data-test-settings-form-submit-button]')
      .isDisabled('Submit button is disabled when `disableSubmit` is `true`');

    await click('[data-test-settings-form-submit-button]');
    assert.notOk(onSubmit.called, '`onSubmit` should not be called when submit button is disabled.');

    this.set('disableSubmit', false);

    await settled();
    assert
      .dom('[data-test-settings-form-submit-button]')
      .isNotDisabled('Submit button is enabled when `disableSubmit` is `false`');

    await click('[data-test-settings-form-submit-button]');

    assert.ok(
      onSubmit.calledOnceWith(
        sinon.match({
          image: sinon.match.string,
          username: sinon.match.string,
          bio: sinon.match.string,
          email: sinon.match.string,
          password: sinon.match.string,
        }),
      ),
      '`onSubmit` should be called when submit button is enabled.',
    );
  });

  test('errors are displayed when `errors` array is populated', async function(assert) {
    assert.expect(4);

    const errors = [];
    this.set('errors', errors);

    await render(hbs`{{settings-form errors=errors}}`);

    assert.dom('[data-test-settings-form-error-item]').doesNotExist();

    errors.addObjects([
      { attribute: 'error1', message: 'error1 message' },
      { attribute: 'error2', message: 'error2 message' },
    ]);
    await settled();

    assert.dom('[data-test-settings-form-error-item]').exists({ count: 2 }, 'Display two error messages');

    errors.forEach(({ attribute, message }, index) => {
      assert.dom(`[data-test-settings-form-error-item]:nth-child(${index + 1})`).hasText(`${attribute} ${message}`);
    });
  });
});
