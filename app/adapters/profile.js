import ApplicationAdapter from './application';

export default class UserAdapter extends ApplicationAdapter {
  pathForType() {
    return 'profiles';
  }
}
