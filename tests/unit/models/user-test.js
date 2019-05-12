import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import setupMirage from 'ember-cli-mirage/test-support/setup-mirage';

module('Unit | Model | user', function(hooks) {
  setupTest(hooks);
  setupMirage(hooks);

  test('#fetchFeed', async function(assert) {
    server.createList('article', 5);
    server.get('/articles/feed', schema => {
      return {
        articles: schema.articles.all().models.map(model => model.attrs),
        articlesCount: 5,
      };
    });
    const model = this.owner.lookup('service:store').createRecord('user');
    const {
      articles,
      meta: { articlesCount },
    } = await model.fetchFeed();
    assert.equal(articles.length, 5, 'The correct number of articles is returned');
    assert.equal(5, articlesCount, 'The articles count is correct');
  });
});
