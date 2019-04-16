import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import moment from 'moment';

module('Integration | Component | feed item', function(hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function(assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });

    const article = {
      author: {
        image: 'https://static.productionready.io/images/smiley-cyrus.jpg',
        username: 'Alon Bukai'
      },
      createdAt: moment('1995-12-25'),
      favoritesCount: 9000,
      tagList: ['firstTag', 'secondTag', 'thirdTag'],
      description: 'This is feed item description',
      slug: 'feed-item-title',
      title: 'Feed Item Title'
    };

    this.set('article', article);
    await render(hbs`{{feed-item article=article }}`);

    assert
      .dom('[data-test-article-author-image]')
      .hasAttribute('src', 'https://static.productionready.io/images/smiley-cyrus.jpg', 'Image is default image');

    assert
      .dom(`[data-test-article-author-username="${article.author.username}"]`)
      .hasText('Alon Bukai', 'Author name is correct');

    assert.dom('[data-test-article-date]').hasText('Dec 25, 1995', 'Date is correct');

    assert.dom('[data-test-article-favoritesCount]').hasText('9000', 'Number of favorites is correct');

    assert.dom('[data-test-article-title]').hasText('Feed Item Title', 'Title is correct');

    assert.dom('[data-test-article-description]').hasText('This is feed item description', 'Description is correct');
  });
});
