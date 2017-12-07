var removeIndent = require('./utils/removeIndent');

/**
 * Handle key command for code blocks
 *
 * @param {Draft.EditorState} editorState
 * @param {String} command
 * @param {Number} indent - Indent depth
 * @return {Boolean}
 */
function handleKeyCommand(editorState, command, indent) {
  if (command === 'backspace') {
    return removeIndent(editorState, indent);
  }
}

module.exports = handleKeyCommand;
