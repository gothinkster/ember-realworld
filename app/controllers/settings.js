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

    /**
     * Action to change key/value on a user model.
     *
     * `bio` attribute is set to `null` when the value is a trimmed empty string because that is the default from the server. Setting the value to an empty string
     * would incorrectly flag the user record as dirty.
     *
     * `password` attribute is set to `undefined` when the value is a trimmed empty string because that is the default from the server. Setting the value to an empty string
     * would incorrectly flag the user record as dirty.
     *
     * @param {Model} user User model to set value on.
     * @param {String} key Key of the value to set.
     * @param {String} value Value to set.
     */
    changeAttr(user, key, value) {
      if (key === 'bio') {
        if (!value.trim()) {
          value = null;
        }
      } else if (key === 'password') {
        if (!value.trim()) {
          value = undefined;
        }
      }

      user.set(key, value);
    },
  },
});
