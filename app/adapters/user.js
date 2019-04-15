import ApplicationAdapter from './application';
import ENV from 'ember-realworld/config/environment';

export default ApplicationAdapter.extend({
  urlForUpdateRecord() {
    return `${ENV.APP.apiHost}/user`;
  }
});
