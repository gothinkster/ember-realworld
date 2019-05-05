import { Factory, faker } from 'ember-cli-mirage';

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
});
