/* global window */
window.deprecationWorkflow = window.deprecationWorkflow || {};
window.deprecationWorkflow.config = {
  workflow: [
    { handler: 'silence', matchId: 'ember-inflector.globals' },
    { handler: 'silence', matchId: 'ember-metal.get-with-default' },
  ],
};
