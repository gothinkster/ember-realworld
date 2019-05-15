import EmberRouter from '@ember/routing/router';
import config from './config/environment';

const Router = EmberRouter.extend({
  location: config.locationType,
  rootURL: config.rootURL,
});

Router.map(function() {
  this.route('home', { path: '/' });

  this.route('login');
  this.route('register');

  this.route('profile', { path: '/profile/:id' }, function() {
    this.route('favorites');
  });
  this.route('settings');

  this.route('article', { path: '/article/:slug' });
  this.route('editor', function() {
    this.route('new', { path: '/' });
    this.route('article', { path: '/:slug' });
  });
  this.route('error', { path: '/*path' });
});

export default Router;
