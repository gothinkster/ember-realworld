const STORAGE_KEY = 'realworld.ember-classic.token';

export function setupLoggedInUser(hooks, token) {
  const originalToken = localStorage.getItem(STORAGE_KEY);

  hooks.beforeEach(function() {
    localStorage.setItem(STORAGE_KEY, token);
  });

  hooks.afterEach(function() {
    localStorage.setItem(STORAGE_KEY, originalToken);
  });
}

export function setupLoggedOutUser(hooks) {
  const originalToken = localStorage.getItem(STORAGE_KEY);

  hooks.beforeEach(function() {
    localStorage.removeItem(STORAGE_KEY);
  });

  hooks.afterEach(function() {
    localStorage.setItem(STORAGE_KEY, originalToken);
  });
}
