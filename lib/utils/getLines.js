var Immutable = require('immutable');
var getNewLine = require('./getNewLine');

/**
 * Return a list of line in this text
 * @param {String} text
 * @param {String} sep (optional)
 * @return {List<String>}
 */
function getLines(text, sep) {
  sep = sep || getNewLine(text);
  return Immutable.List(text.split(sep));
}

module.exports = getLines;
