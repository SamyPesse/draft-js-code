var detectIndent = require('detect-indent');

/**
 * Return indentation of a line
 * @param {String} line
 * @return {String}
 */
function getIndentForLine(line) {
  return detectIndent(line).indent || '';
}

module.exports = getIndentForLine;
