import Ember from 'ember';
import config from './config/environment';

const Router = Ember.Router.extend({
  location: config.locationType,
  rootURL: config.rootURL
});

Router.map(function() {
  this.route('home', { path: '/' });

  this.route('login');
  this.route('register');

  this.route('profile', { path: '/profile/:username' });
  this.route('settings');

  this.route('article', { path: '/article/:slug' });
  this.route('editor', function() {
    this.route('new', { path: '/' });
    this.route('article', { path: '/:slug' });
  });
});

export default Router;
