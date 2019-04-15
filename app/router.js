import EmberRouter from '@ember/routing/router';
import config from './config/environment';

const Router = EmberRouter.extend({
  location: config.locationType,
  rootURL: config.rootURL
});

Router.map(function() {
  this.route('login');
  this.route('register');

  this.route('profile', { path: '/profile/:username' }, function() {
    this.route('favorites');
  });
  this.route('settings');

  this.route('article', { path: '/article/:slug' });
  this.route('editor', function() {
    this.route('new', { path: '/' });
    this.route('article', { path: '/:slug' });
  });
});

export default Router;
