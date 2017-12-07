var buildIndentation = require('../utils/buildIndentation');

describe('buildIndentation', function() {
  it('should correctly translate numbers to spaces', function() {
    var spaces = buildIndentation(2);
    expect(spaces).toBe('  ');
    var spacesAgain = buildIndentation(3);
    expect(spacesAgain).toBe('   ');
  });
});
