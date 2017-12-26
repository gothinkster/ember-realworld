import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import moment from 'moment';

import testSelector from 'ember-test-selectors';

moduleForComponent('feed-item', 'Integration | Component | feed item', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  let article = {
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
  this.render(hbs`{{feed-item article=article }}`);

  assert.equal(
    this.$(testSelector('article-author-image')).attr('src'),
    'https://static.productionready.io/images/smiley-cyrus.jpg',
    'Image is default image'
  );

  assert.equal(
    this.$(testSelector('article-author-username', article.author.username))
      .text()
      .trim(),
    'Alon Bukai',
    'Author name is correct'
  );

  assert.equal(
    this.$(testSelector('article-date'))
      .text()
      .trim(),
    'Dec 25, 1995',
    'Date is correct'
  );

  assert.equal(
    this.$(testSelector('article-favoritesCount'))
      .text()
      .trim(),
    '9000',
    'Number of favorites is correct'
  );

  assert.equal(
    this.$(testSelector('article-title'))
      .text()
      .trim(),
    'Feed Item Title',
    'Title is correct'
  );

  assert.equal(
    this.$(testSelector('article-description'))
      .text()
      .trim(),
    'This is feed item description',
    'Description is correct'
  );

  // assert.equal(find(testSelector('article-tag')).length, 3, 'There are 3 tags'); How do I test this?
});
