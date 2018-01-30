const { EditorState } = require('draft-js');

var increaseIndentation = require('./utils/increaseIndentation');
var decreaseIndentation = require('./utils/decreaseIndentation');

// TODO: tab should complete indentation instead of just inserting one

/**
 * Handle pressing tab in the editor
 *
 * @param {SyntheticKeyboardEvent} event
 * @param {Draft.EditorState} editorState
 * @return {Draft.EditorState}
 */
function onTab(e, editorState, tabSize = 4) {
  e.preventDefault();

  var indentation;
  if (e.shiftKey) {
    const decreasedIndentation = decreaseIndentation(editorState);

    indentation =
      decreasedIndentation !== undefined ? decreasedIndentation : editorState;
  } else {
    indentation = increaseIndentation(editorState);
  }

  return indentation;
}

module.exports = onTab;
