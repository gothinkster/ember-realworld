import ApplicationSerializer from './application';

export default class UserSerializer extends ApplicationSerializer {
  primaryKey = 'username';

  attrs = {
    token: {
      serialize: false,
    },
    createdAt: {
      serialize: false,
    },
    updatedAt: {
      serialize: false,
    },
  };
}
