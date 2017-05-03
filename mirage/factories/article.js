import { Factory, association } from 'ember-cli-mirage';

export default Factory.extend({
  title: 'title',
  tagList: ['dragons', 'training'],
  createdAt: '2016-02-18T03:22:56.637Z',
  updatedAt: '2016-02-18T03:48:35.824Z',
  favorited: false,
  favoritesCount: 0,

  author: association(),

  tagList: ['tag'],

  slug(i) {
    return 'slug-' + i;
  }
});
