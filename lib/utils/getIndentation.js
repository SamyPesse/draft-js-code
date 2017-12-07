var detectIndent = require('detect-indent');

/**
 * Detect indentation in a text
 * @param {String} text
 * @return {String}
 */
function getIndentation(text) {
  var result = detectIndent(text);
  return result.indent;
}

module.exports = getIndentation;
