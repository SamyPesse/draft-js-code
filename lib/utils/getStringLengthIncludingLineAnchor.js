/**
 * Return an anchor of a cursor in a block as a {line,limit} object
 *
 * @param {List} allLines
 * @param {LineAnchor} lineAnchor
 * @return {Number}
 */
function getStringLengthIncludingLineAnchor(allLines, lineAnchor) {
  var stringLengthIncludingLineAnchor = 0;

  // When the cursor is at the start of an empty line or a line with only spaces,
  // its getLine() method returns -1. We will treat it as a 0.
  var lineNumber = lineAnchor.getLine() >= 0 ? lineAnchor.getLine() : 0;
  var lineIndex = 0;
  while (lineIndex <= lineNumber) {
    var currentLine = allLines.get(lineIndex);

    // Newline characters are not included in string.length.
    // So, for each new line, we need to add 1 to the newline offset.
    var newlineOffset = lineIndex === lineNumber ? 0 : 1;

    stringLengthIncludingLineAnchor += currentLine.length + newlineOffset;

    lineIndex++;
  }

  return stringLengthIncludingLineAnchor;
}

module.exports = getStringLengthIncludingLineAnchor;
