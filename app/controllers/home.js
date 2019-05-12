import Controller from '@ember/controller';

export default Controller.extend({
  queryParams: ['tag', 'page'],
  tag: null,
  page: 1,
});
