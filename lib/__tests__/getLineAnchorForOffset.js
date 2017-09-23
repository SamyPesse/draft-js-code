var getLineAnchorForOffset = require('../utils/getLineAnchorForOffset');

describe('getLineAnchorForOffset', function() {
  it('should return right anchor', function() {
    var anchor = getLineAnchorForOffset('Hello\nWorld\ngood', 1);
    expect(anchor.line).toBe(0);
    expect(anchor.offset).toBe(1);
  });

  it('should return right index (2)', function() {
    var anchor = getLineAnchorForOffset('Hello\nWorld\ngood', 6);
    expect(anchor.line).toBe(1);
    expect(anchor.offset).toBe(1);
  });

  it('should handle multichar separator', function() {
    var text = 'Hello\r\nWorld\r\ngood';

    var anchor = getLineAnchorForOffset(text, 5);
    expect(anchor.line).toBe(0);
    expect(anchor.offset).toBe(5);

    anchor = getLineAnchorForOffset(text, 7);
    expect(anchor.line).toBe(1);
    expect(anchor.offset).toBe(2);
  });
});
