import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

import { run } from '@ember/runloop';

module('Unit | Serializer | article', function(hooks) {
  setupTest(hooks);

  // Replace this with your real tests.
  test('it serializes records', function(assert) {
    const record = run(() => this.owner.lookup('service:store').createRecord('article'));

    const serializedRecord = record.serialize();

    assert.ok(serializedRecord);
  });

  test('`normalizeArrayResponse` normalizses an array payload', function(assert) {
    const store = this.owner.lookup('service:store');
    const serializer = store.serializerFor('article');
    const model = store.modelFor('article');
    const articles = [
      {
        slug: 'foo',
        tagList: ['tag'],
      },
    ];
    const result = serializer.normalizeArrayResponse(store, model, { articles, articlesCount: 1 }, undefined, 'foo');
    const expected = {
      data: [
        {
          id: 'foo',
          type: 'article',
          attributes: {},
          relationships: {
            tagList: { data: [{ id: 'tag', type: 'tag' }] },
            comments: { links: { related: 'comments' } },
          },
        },
      ],
      included: [{ id: 'tag', type: 'tag', attributes: { value: 'tag' }, relationships: {} }],
      meta: { articlesCount: 1 },
    };

    assert.deepEqual(result, expected, '`normalizeArrayResponse` returns expected normalized object');
  });

  test('`normalizeSingleResponse` normalizses a single payload', function(assert) {
    assert.expect(1);

    const store = this.owner.lookup('service:store');
    const serializer = store.serializerFor('article');
    const model = store.modelFor('article');
    const article = {
      slug: 'foo',
      tagList: ['tag'],
    };
    const result = serializer.normalizeSingleResponse(store, model, { article }, article.slug, 'foo');
    const expected = {
      data: {
        id: 'foo',
        type: 'article',
        attributes: {},
        relationships: {
          tagList: { data: [{ id: 'tag', type: 'tag' }] },
          comments: { links: { related: 'comments' } },
        },
      },
      included: [{ id: 'tag', type: 'tag', attributes: { value: 'tag' }, relationships: {} }],
    };

    assert.deepEqual(result, expected, '`normalizeSingleResponse` returns expected normalized object');
  });

  test('`normalizeArticle` normalizes an article record', function(assert) {
    assert.expect(1);

    const store = this.owner.lookup('service:store');
    const serializer = store.serializerFor('article');
    const article = {
      slug: 'foo',
      tagList: ['tag'],
    };
    const expected = {
      ...article,
      tagList: [{ value: 'tag' }],
      links: {
        comments: 'comments',
      },
    };

    assert.deepEqual(
      serializer.normalizeArticle(article),
      expected,
      '`normalizeArticle` returns expected normalized article',
    );
  });
});
