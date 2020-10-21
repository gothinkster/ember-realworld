import Application from 'ember-realworld/app';
import config from 'ember-realworld/config/environment';
import { setApplication } from '@ember/test-helpers';
import { start } from 'ember-qunit';

setApplication(Application.create(config.APP));

start();
