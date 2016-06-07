var expect = require('expect');
var getLineForOffset = require('../getLineForOffset');

describe('getLineForOffset', function() {

    it('should return right index', function() {
        var line = getLineForOffset('Hello\nWorld\ngood', 1);
        expect(line).toBe(0);
    });

    it('should return right index (2)', function() {
        var line = getLineForOffset('Hello\nWorld\ngood', 6);
        expect(line).toBe(1);
    });

    it('should handle multichar separator', function() {
        var text = 'Hello\r\nWorld\r\ngood';

        var line = getLineForOffset(text, 5);
        expect(line).toBe(0);

        line = getLineForOffset(text, 7);
        expect(line).toBe(1);
    });

});

