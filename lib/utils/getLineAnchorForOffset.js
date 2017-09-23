var Immutable = require('immutable');
var getNewLine = require('./getNewLine');

var LineAnchor = Immutable.Record({
  // Index of the current line
  line: Number(0),

  // Offset in current line
  offset: Number(0)
});

LineAnchor.prototype.getLine = function() {
  return this.get('line');
};

LineAnchor.prototype.getOffset = function() {
  return this.get('offset');
};

/**
 * Return an anchor of a cursor in a block as a {line,offset} object
 *
 * @param {String} text
 * @param {Number} offset
 * @param {String} sep (optional)
 * @return {LineAnchor}
 */
function getLineAnchorForOffset(text, offset, sep) {
  sep = sep || getNewLine(text);

  var lineIndex = 0;
  var nextLineIndex = 0;
  var lastLineIndex = 0;

  while (nextLineIndex >= 0 && nextLineIndex < offset) {
    lineIndex++;

    lastLineIndex = nextLineIndex;
    nextLineIndex = text.indexOf(sep, nextLineIndex + sep.length);
  }

  return new LineAnchor({
    line: lineIndex - 1,
    offset: offset - lastLineIndex
  });
}

module.exports = getLineAnchorForOffset;
