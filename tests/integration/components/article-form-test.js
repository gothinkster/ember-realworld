import { module } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, fillIn, triggerKeyEvent, click, settled } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import test from 'ember-sinon-qunit/test-support/test';
import sinon from 'sinon';

module('Integration | Component | article-form', function(hooks) {
  setupRenderingTest(hooks);

  let article;

  hooks.beforeEach(function() {
    article = {
      title: '',
      description: '',
      body: '',
      tags: [],
    };

    this.set('article', article);
  });

  test('title input triggers change action', async function(assert) {
    assert.expect(2);

    const onChange = this.spy();

    this.set('onChange', onChange);

    await render(hbs`{{article-form title="title?" onChange=onChange}}`);

    assert.dom('[data-test-article-form-input-title]').hasValue('title?');

    await fillIn('[data-test-article-form-input-title]', 'title!!!');

    assert.ok(onChange.calledOnceWith('title', 'title!!!'), '`onChange` to be called with expected properties');
  });

  test('description input triggers change action', async function(assert) {
    assert.expect(2);

    const onChange = this.spy();

    this.set('onChange', onChange);

    await render(hbs`{{article-form description="description?" onChange=onChange}}`);

    assert.dom('[data-test-article-form-input-description]').hasValue('description?');

    await fillIn('[data-test-article-form-input-description]', 'description!!!');

    assert.ok(
      onChange.calledOnceWith('description', 'description!!!'),
      '`onChange` to be called with expected properties',
    );
  });

  test('body input triggers change action', async function(assert) {
    assert.expect(2);

    const onChange = this.spy();

    this.set('onChange', onChange);

    await render(hbs`{{article-form body="body?" onChange=onChange}}`);

    assert.dom('[data-test-article-form-input-body]').hasValue('body?');

    await fillIn('[data-test-article-form-input-body]', 'body!!!');

    assert.ok(onChange.calledOnceWith('body', 'body!!!'), '`onChange` to be called with expected properties');
  });

  module('tags', function() {
    test('added via input by triggering change action with an array of tags added to the existing tags', async function(assert) {
      assert.expect(3);

      const onChange = this.spy();
      const tags = [];

      this.set('onChange', onChange);
      this.set('tags', tags);

      await render(hbs`{{article-form tags=tags onChange=onChange}}`);

      assert.dom('[data-test-article-form-input-tags]').hasNoValue();

      await fillIn('[data-test-article-form-input-tags]', 'tag1, tag2, tag3');
      await triggerKeyEvent('[data-test-article-form-input-tags]', 'keydown', 'Enter');

      assert.ok(
        onChange.calledOnceWith('tags', sinon.match.array.contains(['tag1', 'tag2', 'tag3'])),
        '`onChange` to be called with expected properties',
      );

      const newTags = onChange.args[0][1];
      assert.notEqual(tags, newTags, 'New array of tags is and separate instance of source `tags` array');
    });

    test('removed by triggering change action with an array of tags removed from the existing tags', async function(assert) {
      assert.expect(4);

      const onChange = this.spy();
      const tags = ['tag1'];

      this.set('onChange', onChange);
      this.set('tags', tags);

      await render(hbs`{{article-form tags=tags onChange=onChange}}`);

      assert.dom('[data-test-article-form-tag-remove-button]').exists({ count: 1 });

      await click('[data-test-article-form-tag-remove-button]');

      assert.ok(onChange.calledOnceWith('tags', sinon.match.array), '`onChange` to be called with expected properties');

      const newTags = onChange.args[0][1];
      assert.notEqual(tags, newTags, 'New array of tags is and separate instance of source `tags` array');
      assert.equal(newTags.length, 0, 'New array of tags should be empty when a tag is to be removed');
    });
  });

  test('`isNew` controls the text displayed in the `submit` button', async function(assert) {
    assert.expect(2);

    this.set('isNew', true);

    await render(hbs`{{article-form isNew=isNew}}`);
    assert
      .dom('[data-test-article-form-submit-button]')
      .hasText('Create Post', 'Show "Create Post` when `isNew` property is true');

    this.set('isNew', false);

    await settled();
    assert
      .dom('[data-test-article-form-submit-button]')
      .hasText('Publish Post', 'Show "Publish Post` when `isNew` property is false');
  });

  test('`submit` button triggers `submit` action', async function(assert) {
    assert.expect(4);

    const onSubmit = this.spy();
    this.set('onSubmit', onSubmit);
    this.set('disableSubmit', true);

    await render(hbs`{{article-form onSubmit=onSubmit disableSubmit=disableSubmit}}`);

    assert
      .dom('[data-test-article-form-submit-button]')
      .isDisabled('Submit button is disabled when `disableSubmit` is `true`');

    await click('[data-test-article-form-submit-button]');
    assert.notOk(onSubmit.called, '`onSubmit` should not be called when submit button is disabled.');

    this.set('disableSubmit', false);

    await settled();
    assert
      .dom('[data-test-article-form-submit-button]')
      .isNotDisabled('Submit button is not disabled when `disableSubmit` is `false`');

    await click('[data-test-article-form-submit-button]');

    assert.ok(
      onSubmit.calledOnceWith(
        sinon.match({
          title: sinon.match.string,
          body: sinon.match.string,
          description: sinon.match.string,
          tags: sinon.match.array,
        }),
      ),
      '`onSubmit` should not be called when submit button is disabled.',
    );
  });
  test('errors are displayed when `errors` array is populated', async function(assert) {
    assert.expect(4);

    const errors = [];
    this.set('errors', errors);

    await render(hbs`{{article-form errors=errors}}`);

    assert.dom('[data-test-article-form-error-item]').doesNotExist();

    errors.addObjects([
      { attribute: 'error1', message: 'error1 message' },
      { attribute: 'error2', message: 'error2 message' },
    ]);
    await settled();

    assert.dom('[data-test-article-form-error-item]').exists({ count: 2 }, 'Display two error messages');

    errors.forEach(({ attribute, message }, index) => {
      assert.dom(`[data-test-article-form-error-item]:nth-child(${index + 1})`).hasText(`${attribute} ${message}`);
    });
  });
});
