var insertNewLine = require('./utils/insertNewLine');

/**
 *  We split code blocks only if user pressed Cmd+Enter
 *
 * @param {SyntheticKeyboardEvent} e
 * @param {Draft.EditorState} editorState
 * @return {Draft.EditorState}
 */
function handleReturn(e, editorState) {
  return insertNewLine(editorState);
}

module.exports = handleReturn;
