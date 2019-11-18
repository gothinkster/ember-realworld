import { Factory } from 'ember-cli-mirage';
import faker from 'faker';

export default Factory.extend({
  token: 'auth-token',

  image: null,

  email() {
    return faker.internet.email();
  },

  username() {
    return faker.internet.userName();
  },

  bio() {
    return faker.lorem.paragraph();
  },

  following() {
    return faker.random.boolean();
  },
});
