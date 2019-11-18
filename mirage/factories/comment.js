import { Factory, association } from 'ember-cli-mirage';
import faker from 'faker';

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
