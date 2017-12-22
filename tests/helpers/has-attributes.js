import QUnit from 'qunit';
/*
  This assertion will compare 2 arrays of attributes.
  It first convert the attributes Map to an Array,
  then sorts both arrays and then compares each element.

  @method hasAttributes
  @param {Map} actualAttributes
  @param {Array} expectedAttributes
*/
function compareArrays(actualAttributes, expectedAttributes) {
  expectedAttributes.sort();

  return actualAttributes.sort().every((element, index) => {
    return element === expectedAttributes[index];
  });
}

QUnit.assert.hasAttributes = function(actualAttributes, expectedAttributes) {
  this.expect(2);

  let actualAttributesArray = [];
  actualAttributes.forEach((meta, name) => {
    actualAttributesArray.push(name);
  });

  this.ok(actualAttributesArray.length === expectedAttributes.length, `should have ${expectedAttributes.length} attributes`);
  this.ok(compareArrays(actualAttributesArray, expectedAttributes), 'should have the expected attributes');
};
