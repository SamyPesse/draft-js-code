var detectIndent = require('detect-indent');

var DEFAULT_INDENTATION = '    ';

/**
 * Detect indentation in a text
 * @param {String} text
 * @return {String}
 */
function getIndentation(text) {
  var result = detectIndent(text);
  return result.indent || DEFAULT_INDENTATION;
}

module.exports = getIndentation;
