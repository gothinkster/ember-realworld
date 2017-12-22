import { moduleForModel } from 'ember-qunit';
import { testForAttributes } from 'realworld-ember/tests/helpers/attributes';
import { testForBelongsTo } from 'realworld-ember/tests/helpers/relationships';

moduleForModel('comment', 'Unit | Model | comment', {
  needs: ['model:user']
});

testForAttributes('comment', ['body', 'createdAt', 'updateAt']);
testForBelongsTo('comment', 'author');
