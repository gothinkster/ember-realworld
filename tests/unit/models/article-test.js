import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import setupMirage from 'ember-cli-mirage/test-support/setup-mirage';

module('Unit | Model | article', function(hooks) {
  setupTest(hooks);
  setupMirage(hooks);

  let store;
  hooks.beforeEach(function() {
    store = this.owner.lookup('service:store');
  });

  module('favoriting', function() {
    test('#favorite', async function(assert) {
      const mockArticle = server.create('article', {
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
        const article = schema.articles.first();
        const attrs = article.attrs;
        attrs.favorited = true;
        attrs.slug = attrs.id;
        attrs.tagList = [];
        return { article: attrs };
      });
      assert.notOk(article.favorited, 'The article is not initially favorited');
      await article.favorite();
      assert.ok(article.favorited, 'The article is then favorited');
    });

    test('#unfavorite', async function(assert) {
      const mockArticle = server.create('article', {
        title: 'This is the title',
        body: 'This is the body',
        favorited: true,
      });
      const store = this.owner.lookup('service:store');
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
        attrs.slug = attrs.id;
        attrs.tagList = [];
        return { article: attrs };
      });
      assert.ok(article.favorited, 'The article is initially favorited');
      await article.unfavorite();
      assert.notOk(article.favorited, 'The article is no longer favorited');
    });
  });
});
