import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import setupMirage from 'ember-cli-mirage/test-support/setup-mirage';
import sinon from 'sinon';

module('Unit | Serializer | profile', function(hooks) {
  setupTest(hooks);
  setupMirage(hooks);

  // Replace this with your real tests.
  test('it exists', function(assert) {
    const store = this.owner.lookup('service:store');
    const serializer = store.serializerFor('profile');

    assert.ok(serializer);
  });

  test('it serializes records', function(assert) {
    const store = this.owner.lookup('service:store');
    const record = store.createRecord('profile', {});

    const serializedRecord = record.serialize();

    assert.ok(serializedRecord);
  });

  test('`primaryKey` should be `username`', function(assert) {
    assert.expect(1);

    const store = this.owner.lookup('service:store');
    const serializer = store.serializerFor('profile');

    assert.equal(serializer.primaryKey, 'username', '`primaryKey` should be`username`');
  });

  test('`normalizeFindRecordResponse` method normalizes profile payload', function(assert) {
    assert.expect(1);

    const store = this.owner.lookup('service:store');
    const serializer = store.serializerFor('profile');
    const primaryModelClass = store.modelFor('profile');
    const profile = server.create('profile').toJSON();
    const payload = {
      profile,
    };
    const articleAdapter = store.adapterFor('article');
    /**
     * Need to define the host, URLs built by the adapter will be relative, which will cause `URL` API to throw.
     */
    articleAdapter.host = location.origin;

    const articlesURL = articleAdapter.buildURL('article');
    const normalizedResponse = serializer.normalizeFindRecordResponse(store, primaryModelClass, payload);
    const expectedResponse = {
      data: {
        id: profile.username,
        type: 'profile',
        attributes: {
          bio: profile.bio,
          image: profile.image,
          following: profile.following,
          username: profile.username,
        },
        relationships: {
          articles: { links: { related: `${articlesURL}?author=${profile.username}` } },
          favoriteArticles: { links: { related: `${articlesURL}?favorited=${profile.username}` } },
        },
      },
      included: [],
    };

    sinon.assert.match(normalizedResponse, expectedResponse);
  });
});
