import Base from 'ember-simple-auth/authorizers/base';

export default Base.extend({
  authorize(data, block) {
    let authData = data.token;
    block('Authorization', `Token ${authData}`);
  }
});
