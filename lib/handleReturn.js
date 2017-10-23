var Draft = require('draft-js');
var insertNewLine = require('./utils/insertNewLine');

/**
 *  We split code blocks only if user pressed Cmd+Enter
 *
 * @param {SyntheticKeyboardEvent} event
 * @param {Draft.EditorState} editorState
 * @return {Draft.EditorState}
 */
function handleReturn(e, editorState) {
  var contentState = editorState.getCurrentContent();
  var selection = editorState.getSelection();

  return insertNewLine(editorState);
}

module.exports = handleReturn;
