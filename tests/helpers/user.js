import SessionService from 'ember-realworld/services/session';

export const TOKEN = 'auth-token';

export function setupLoggedInUser(hooks, token = TOKEN) {
  const originalToken = localStorage.getItem(SessionService.STORAGE_KEY);

  hooks.beforeEach(function () {
    localStorage.setItem(SessionService.STORAGE_KEY, token || '');
  });

  hooks.afterEach(function () {
    localStorage.setItem(SessionService.STORAGE_KEY, originalToken || '');
  });
}

export function setupLoggedOutUser(hooks) {
  const originalToken = localStorage.getItem(SessionService.STORAGE_KEY);

  hooks.beforeEach(function () {
    localStorage.removeItem(SessionService.STORAGE_KEY);
  });

  hooks.afterEach(function () {
    localStorage.setItem(SessionService.STORAGE_KEY, originalToken || '');
  });
}
