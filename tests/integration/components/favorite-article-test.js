import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import setupMirage from 'ember-cli-mirage/test-support/setup-mirage';
import { click, render, settled } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import { setupLoggedInUser } from 'realworld-ember/tests/helpers/user';
import Session from 'realworld-ember/services/session';

module('Integration | Component | favorite-article', function(hooks) {
  setupRenderingTest(hooks);
  setupMirage(hooks);

  let store;
  let mockArticle;
  const template = hbs`{{favorite-article article=article isIconOnly=isIconOnly}}`;
  const button = '[data-test-favorite-article-button]';
  const favoriteText = '[data-test-favorite-text]';

  hooks.beforeEach(function() {
    store = this.owner.lookup('service:store');
  });

  module('favoriting', function(hooks) {
    setupLoggedInUser(hooks);

    hooks.beforeEach(function() {
      const session = {
        isLoggedIn: true,
        user: {
          username: 'joe blogs',
          image: 'https://static.productionready.io/images/smiley-cyrus.jpg',
        },
      };
      this.owner.register('service:session', Session.extend(session));
    });

    test('#favorite', async function(assert) {
      mockArticle = server.create('article', {
        title: 'This is the title',
        body: 'This is the body',
      });
      store.pushPayload({
        articles: [
          {
            slug: mockArticle.id,
            title: mockArticle.title,
            body: mockArticle.body,
          },
        ],
      });
      const article = store.peekRecord('article', mockArticle.id);
      server.post(`/articles/${mockArticle.id}/favorite`, schema => {
        const schemaArticle = schema.articles.first();
        const attrs = schemaArticle.attrs;
        attrs.favorited = true;
        attrs.slug = mockArticle.id;
        attrs.tagList = [];
        return { article: attrs };
      });
      this.setProperties({
        article,
        isIconOnly: false,
      });
      await render(template);
      assert.dom(button).hasClass('btn-primary', 'The article is not initially favorited');
      await click(button);
      await settled();
      assert.dom(button).hasClass('btn-outline-primary', 'The article is favorited');
    });

    test('#unfavorite', async function(assert) {
      mockArticle = server.create('article', {
        title: 'This is the title',
        body: 'This is the body',
        favorited: true,
      });
      store.pushPayload({
        articles: [
          {
            slug: mockArticle.id,
            title: mockArticle.title,
            body: mockArticle.body,
            favorited: true,
          },
        ],
      });
      const article = store.peekRecord('article', mockArticle.id);
      server.delete(`/articles/${mockArticle.id}/favorite`, schema => {
        const article = schema.articles.first();
        const attrs = article.attrs;
        attrs.favorited = false;
        attrs.slug = mockArticle.id;
        attrs.tagList = [];
        return { article: attrs };
      });
      this.setProperties({
        article,
        isIconOnly: false,
      });
      await render(template);
      assert.dom(button).hasClass('btn-outline-primary', 'The article is initially favorited');
      await click(button);
      await settled();
      assert.dom(button).hasClass('btn-primary', 'The article is unfavorited');
    });
  });

  module('#isIconOnly', function() {
    hooks.beforeEach(function() {
      mockArticle = server.create('article', {
        title: 'This is the title',
        body: 'This is the body',
      });
      store.pushPayload({
        articles: [
          {
            slug: mockArticle.id,
            title: mockArticle.title,
            body: mockArticle.body,
          },
        ],
      });
    });

    test('#isIconOnly is true', async function(assert) {
      const article = store.peekRecord('article', mockArticle.id);
      this.setProperties({
        article,
        isIconOnly: false,
      });
      await render(template);
      assert.dom(favoriteText).exists('The favorite text is visible');
    });

    test('#isIconOnly is false', async function(assert) {
      const article = store.peekRecord('article', mockArticle.id);
      this.setProperties({
        article,
        isIconOnly: true,
      });
      await render(template);
      assert.dom(favoriteText).doesNotExist('The favorite text is not visible');
    });
  });
});
