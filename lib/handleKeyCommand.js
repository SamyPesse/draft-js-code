var removeIndent = require('./utils/removeIndent');

/**
 * Handle key command for code blocks
 *
 * @param {Draft.EditorState} editorState
 * @param {String} command
 * @return {Boolean}
 */
function handleKeyCommand(editorState, command) {
  if (command === 'backspace') {
    return removeIndent(editorState);
  }
}

module.exports = handleKeyCommand;
