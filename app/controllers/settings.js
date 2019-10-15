import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { readOnly } from '@ember/object/computed';
import ENV from '../config/environment';

const { environment } = ENV;

export default Controller.extend({
  session: service(),
  user: readOnly('session.user'),

  actions: {
    signOut() {
      this.session.logOut();
      return this.transitionToRoute('index');
    },

    async saveSettings(user, { image, username, bio, email, password }) {
      user.setProperties({
        image,
        username,
        bio,
        email,
        password,
      });

      try {
        await user.save();

        return this.transitionToRoute('profile', user.username);
      } catch (e) {
        if (environment !== 'test') {
          throw e;
        }
      }
    },

    changeAttr(user, key, value) {
      user.set(key, value);
    },
  },
});
