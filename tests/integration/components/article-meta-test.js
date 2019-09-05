import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { click, render, settled } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import { formatDate } from 'realworld-ember/helpers/format-date';

module('Integration | Component | article-meta', function(hooks) {
  setupRenderingTest(hooks);

  let date;
  let dateISOString;
  let article;

  hooks.beforeEach(function() {
    date = new Date();
    dateISOString = date.toISOString();
    article = {
      author: {
        image: 'https://static.productionready.io/images/smiley-cyrus.jpg',
        id: 'AlonBukai',
        following: false,
      },
      createdAt: dateISOString,
      updatedAt: dateISOString,
      favorited: false,
      favoritesCount: 9000,
      tagList: ['firstTag', 'secondTag', 'thirdTag'],
      description: 'This is feed item description',
      slug: 'feed-item-title',
      title: 'Feed Item Title',
    };

    this.set('article', article);
  });

  test('it renders', async function(assert) {
    assert.expect(12);

    this.setProperties({
      onFollowAuthor() {},
      onFavoriteArticle() {},
    });

    await render(
      hbs`{{article-meta article=article onFollowAuthor=onFollowAuthor onFavoriteArticle=onFavoriteArticle}}`,
    );

    assert
      .dom('[data-test-article-author-image]')
      .hasAttribute('src', 'https://static.productionready.io/images/smiley-cyrus.jpg', 'Image is default image');

    assert
      .dom(`[data-test-article-author-username="${article.author.id}"]`)
      .hasText('AlonBukai', 'Author name is correct');

    assert.dom('[data-test-article-date]').hasText(formatDate([date]), 'Date is correct');

    assert.dom('[data-test-follow-author-button-login]').includesText(`Follow ${article.author.id}`);

    assert
      .dom('[data-test-follow-author-button]')
      .isNotVisible('Follow author button is not visible when user is logged out');

    assert.dom('[data-test-favorite-article-button-login]').includesText(`Favorite Post`);

    assert
      .dom('[data-test-favorite-article-button]')
      .isNotVisible('Favorite article button is not visible when user is logged out');

    assert.dom('[data-test-article-favorites-count]').hasText('9000', 'Number of favorites is correct');

    await render(
      hbs`{{article-meta article=article isLoggedIn=true onFollowAuthor=onFollowAuthor onFavoriteArticle=onFavoriteArticle}}`,
    );

    assert.dom('[data-test-follow-author-button]').includesText(`Follow ${article.author.id}`);

    assert
      .dom('[data-test-follow-author-button-login]')
      .isNotVisible('Follow author login button is not visible when user is logged in');

    assert.dom('[data-test-favorite-article-button]').includesText(`Favorite Post`);

    assert
      .dom('[data-test-favorite-article-button-login]')
      .isNotVisible('Favorite article login button is not visible when user is logged in');
  });

  test('clicking on `follow-author` button triggers `onFollowAuthor` method', async function(assert) {
    assert.expect(2);

    const onFollowAuthor = () => {
      const isFollowing = this.get('article.author.following');
      this.set('article.author.following', !isFollowing);
    };

    this.setProperties({
      onFollowAuthor,
      onFavoriteArticle() {},
    });
    await render(
      hbs`{{article-meta article=article isLoggedIn=true onFollowAuthor=onFollowAuthor onFavoriteArticle=onFavoriteArticle}}`,
    );

    await click('[data-test-follow-author-button]');
    await settled();

    assert.ok(this.get('article.author.following'), '`onFollowAuthor` method to be triggered');
    assert
      .dom('[data-test-follow-author-button]')
      .includesText(`Unfollow ${article.author.id}`, 'Button text is updated');
  });

  test('clicking on `favorite-article` button triggers `onFollowAuthor` method', async function(assert) {
    assert.expect(3);

    const onFavoriteArticle = () => {
      const isFavorite = this.get('article.favorited');
      const favoritesCount = this.get('article.favoritesCount');
      this.set('article.favorited', !isFavorite);
      this.set('article.favoritesCount', !isFavorite ? favoritesCount + 1 : favoritesCount - 1);
    };

    this.set('onFavoriteArticle', onFavoriteArticle);
    this.setProperties({
      onFavoriteArticle,
      onFollowAuthor() {},
    });
    await render(
      hbs`{{article-meta article=article isLoggedIn=true onFollowAuthor=onFollowAuthor onFavoriteArticle=onFavoriteArticle}}`,
    );

    await click('[data-test-favorite-article-button]');
    await settled();

    assert.ok(this.get('article.favorited'), '`onFavoriteArticle` method to be triggered');
    assert.dom('[data-test-favorite-article-button]').includesText(`Unfavorite Post`, 'Button text is updated');
    assert.dom('[data-test-article-favorites-count]').hasText('9001', 'Number of favorites is correct');
  });
});
