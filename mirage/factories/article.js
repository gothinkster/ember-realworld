import { Factory } from 'ember-cli-mirage';

export default Factory.extend({
  description: 'description',

  title: 'title',

  slug(i) {
    return 'slug-' + i;
  }
});
