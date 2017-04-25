import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('feed-item', 'Integration | Component | feed item', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{feed-item}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(
    hbs`
    {{#feed-item}}
      template block text
    {{/feed-item}}
  `
  );

  assert.equal(this.$().text().trim(), 'template block text');
});
