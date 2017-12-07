var DEFAULT_INDENTATION = '    ';

/**
 * Build indent from given number of spaces
 * @param indent
 * @return {string}
 */
function buildIndentation(indent) {
  if (typeof indent !== 'number') {
    return DEFAULT_INDENTATION;
  }

  var spaces = '';
  for (var i = 0, j = indent; i < j; i++) {
    spaces += ' ';
  }
  return spaces;
}

module.exports = buildIndentation;
