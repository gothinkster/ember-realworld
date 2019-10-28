import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import { formatDate } from 'realworld-ember/helpers/format-date';

module('Integration | Component | feed item', function(hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function(assert) {
    const date = new Date();
    const dateISOString = date.toISOString();
    const article = {
      author: {
        image: 'https://static.productionready.io/images/smiley-cyrus.jpg',
        id: 'AlonBukai',
      },
      createdAt: dateISOString,
      updatedAt: dateISOString,
      favoritesCount: 9000,
      tagList: ['firstTag', 'secondTag', 'thirdTag'],
      description: 'This is feed item description',
      slug: 'feed-item-title',
      id: 'feed-item-title',
      title: 'Feed Item Title',
    };

    this.set('article', article);
    await render(hbs`{{feed-item article=article }}`);

    assert
      .dom('[data-test-article-author-image]')
      .hasAttribute('src', 'https://static.productionready.io/images/smiley-cyrus.jpg', 'Image is default image');

    assert
      .dom(`[data-test-article-author-username="${article.author.id}"]`)
      .hasText('AlonBukai', 'Author name is correct');

    assert.dom('[data-test-article-date]').hasText(formatDate([date]), 'Date is correct');

    assert.dom('[data-test-article-favorites-count]').hasText('9000', 'Number of favorites is correct');

    assert.dom('[data-test-article-title]').hasText('Feed Item Title', 'Title is correct');

    assert.dom('[data-test-article-description]').hasText('This is feed item description', 'Description is correct');
  });
});
