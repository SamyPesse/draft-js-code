var getNewLine = require('./getNewLine');

/**
 * Return an index of line
 * @param {String} text
 * @param {Number} offset
 * @param {String} sep (optional)
 * @return {Number}
 */
function getLineForOffset(text, offset, sep) {
    sep = sep || getNewLine(text);

    var result = 0;
    var nextLineIndex = 0;

    while (nextLineIndex >= 0 && nextLineIndex < offset) {
        result++;
        nextLineIndex = text.indexOf(sep, nextLineIndex + sep.length);
    }

    return (result - 1);
}

module.exports = getLineForOffset;
