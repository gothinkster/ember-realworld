import ApplicationAdapter from './application';
import ENV from 'ember-realworld/config/environment';

export default class UserAdapter extends ApplicationAdapter {
  urlForUpdateRecord() {
    return `${ENV.APP.apiHost}/user`;
  }
}
