import { module } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { click, render, settled } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import { formatDate } from 'realworld-ember/helpers/format-date';
import test from 'ember-sinon-qunit/test-support/test';

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
    assert.expect(22);

    this.setProperties({
      onFollowAuthor() {},
      onFavoriteArticle() {},
      onDeleteArticle() {},
    });

    await render(
      hbs`{{article-meta article=article onFollowAuthor=onFollowAuthor onFavoriteArticle=onFavoriteArticle onDeleteArticle=onDeleteArticle}}`,
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

    assert
      .dom('[data-test-edit-article-button]')
      .isNotVisible('Edit article button is not visible when user is logged out');

    assert
      .dom('[data-test-delete-article-button]')
      .isNotVisible('Delete article button is not visible when user is logged out');

    await render(
      hbs`{{article-meta article=article isLoggedIn=true onFollowAuthor=onFollowAuthor onFavoriteArticle=onFavoriteArticle onDeleteArticle=onDeleteArticle}}`,
    );

    assert.dom('[data-test-follow-author-button]').includesText(`Follow ${article.author.id}`);

    assert
      .dom('[data-test-follow-author-button-login]')
      .isNotVisible('Follow author login button is not visible when user is logged in');

    assert.dom('[data-test-favorite-article-button]').includesText(`Favorite Post`);

    assert
      .dom('[data-test-favorite-article-button-login]')
      .isNotVisible('Favorite article login button is not visible when user is logged in');

    assert
      .dom('[data-test-edit-article-button]')
      .isNotVisible('Edit article button is not visible when user is logged in but cannot edit');

    assert
      .dom('[data-test-delete-article-button]')
      .isNotVisible('Delete article button is not visible when user is logged in but cannot edit');

    await render(
      hbs`{{article-meta article=article isLoggedIn=true canEdit=true onFollowAuthor=onFollowAuthor onFavoriteArticle=onFavoriteArticle onDeleteArticle=onDeleteArticle}}`,
    );

    assert
      .dom('[data-test-follow-author-button-login]')
      .isNotVisible('Follow author login button is not visible when user is logged in but can edit');

    assert
      .dom('[data-test-follow-author-button]')
      .isNotVisible('Follow author button is not visible when user is logged in but can edit');

    assert
      .dom('[data-test-favorite-article-button-login]')
      .isNotVisible('Favorite article login button is not visible when user is logged in but can edit');

    assert
      .dom('[data-test-favorite-article-button]')
      .isNotVisible('Favorite article button is not visible when user is logged in but can edit');

    assert
      .dom('[data-test-edit-article-button]')
      .isVisible('Edit article button is visible when user is logged in and can edit');

    assert
      .dom('[data-test-delete-article-button]')
      .isVisible('Delete article button is not visible when user is logged in and can edit');
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
      onDeleteArticle() {},
    });
    await render(
      hbs`{{article-meta article=article isLoggedIn=true onFollowAuthor=onFollowAuthor onFavoriteArticle=onFavoriteArticle onDeleteArticle=onDeleteArticle}}`,
    );

    await click('[data-test-follow-author-button]');
    await settled();

    assert.ok(this.get('article.author.following'), '`onFollowAuthor` action to be triggered with `author`');
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

    this.setProperties({
      onFavoriteArticle,
      onFollowAuthor() {},
      onDeleteArticle() {},
    });
    await render(
      hbs`{{article-meta article=article isLoggedIn=true onFollowAuthor=onFollowAuthor onFavoriteArticle=onFavoriteArticle onDeleteArticle=onDeleteArticle}}`,
    );

    await click('[data-test-favorite-article-button]');
    await settled();

    assert.ok(this.get('article.favorited'), '`onFavoriteArticle` action to be triggered with `article`');
    assert.dom('[data-test-favorite-article-button]').includesText(`Unfavorite Post`, 'Button text is updated');
    assert.dom('[data-test-article-favorites-count]').hasText('9001', 'Number of favorites is correct');
  });

  test('clicking on `delete-article` button triggers `onDeleteArticle` method', async function(assert) {
    assert.expect(1);

    const onDeleteArticle = this.spy();

    this.setProperties({
      onFavoriteArticle() {},
      onFollowAuthor() {},
      onDeleteArticle,
    });

    await render(
      hbs`{{article-meta article=article isLoggedIn=true canEdit=true onFollowAuthor=onFollowAuthor onFavoriteArticle=onFavoriteArticle onDeleteArticle=onDeleteArticle}}`,
    );
    await click('[data-test-delete-article-button]');

    assert.ok(onDeleteArticle.calledOnceWith(article), '`onDeleteArticle` action to be triggered with `article`');
  });
});
