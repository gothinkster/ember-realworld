import Component from '@ember/component';

export default Component.extend({
  image: '',
  username: '',
  bio: '',
  email: '',
  password: '',

  actions: {
    submit() {
      const { image, username, bio, email, password } = this;

      return this.onSubmit({
        image,
        username,
        bio,
        email,
        password,
      });
    },

    change(field, event) {
      return this.onChange(field, event.target.value);
    },
  },
});
