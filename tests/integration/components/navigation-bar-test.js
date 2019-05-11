import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | navigation-bar', function(hooks) {
  setupRenderingTest(hooks);

  test('it renders signed out', async function(assert) {
    await render(hbs`{{navigation-bar}}`);

    assert.dom('nav.navbar.navbar-light').exists();
    assert.dom('[data-test-navigation-bar-sign-in]').exists();
    assert.dom('[data-test-navigation-bar-editor-new]').doesNotExist();
  });

  test('it renders signed in', async function(assert) {
    const session = {
      isLoggedIn: true,
      user: {
        username: 'joe blogs',
        image: 'https://static.productionready.io/images/smiley-cyrus.jpg',
      },
    };

    this.set('session', session);

    await render(hbs`{{navigation-bar session=session}}`);

    assert.dom('[data-test-navigation-bar-editor-new]').exists();
    assert.dom('[data-test-navigation-bar-sign-in]').doesNotExist();
    assert.dom('[data-test-currentUser-loggedIn]').containsText('joe blogs');

    assert
      .dom('[data-test-currentUser-user-pic]')
      .hasAttribute('src', 'https://static.productionready.io/images/smiley-cyrus.jpg');
  });
});
