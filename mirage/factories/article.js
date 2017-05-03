import { Factory, association, faker } from 'ember-cli-mirage';

export default Factory.extend({
  author: association(),

  title() {
    return faker.lorem.words();
  },

  tagList: ['dragons', 'training'],

  createdAt() {
    return faker.date.recent();
  },

  updatedAt() {
    return faker.date.recent();
  },

  favorited() {
    return faker.random.boolean();
  },
  favoritesCount() {
    return faker.random.number(100);
  },

  tagList: ['tag'],

  slug(i) {
    return faker.helpers.slugify(this.title);
  }
});
