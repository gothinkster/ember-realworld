import { Factory, association, faker } from 'ember-cli-mirage';

export default Factory.extend({
  author: association(),
  article: association(),

  createdAt() {
    return faker.date.recent();
  },

  updatedAt() {
    return faker.date.recent();
  },

  body() {
    return faker.lorem.paragraphs();
  },
});
