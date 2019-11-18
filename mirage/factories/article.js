import { Factory, association } from 'ember-cli-mirage';
import faker from 'faker';

const tags = ['emberjs', 'tomster', 'wycats', 'tomdale', 'ember-cli', 'training', 'dragons'];

export default Factory.extend({
  author: association(),

  title() {
    return faker.lorem.words();
  },

  description() {
    return faker.lorem.paragraphs();
  },

  body() {
    return faker.lorem.paragraphs();
  },

  tagList() {
    if (faker.random.boolean()) {
      return [faker.random.arrayElement(tags), faker.random.arrayElement(tags)];
    } else {
      return [];
    }
  },

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

  slug() {
    return faker.helpers.slugify(this.title);
  },
});
