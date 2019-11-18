import { Factory } from 'ember-cli-mirage';
import faker from 'faker';

export default Factory.extend({
  username() {
    return faker.internet.userName();
  },

  bio() {
    return faker.lorem.sentence();
  },

  image() {
    return faker.internet.avatar();
  },

  following() {
    return faker.random.boolean();
  },
});
