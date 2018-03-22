var increaseIndentation = require('./utils/increaseIndentation');
var decreaseIndentation = require('./utils/decreaseIndentation');

// TODO: tab should complete indentation instead of just inserting one

var DEFAULT_TAB_SIZE = 4;

/**
 * Handle pressing tab in the editor
 *
 * @param {SyntheticKeyboardEvent} event
 * @param {Draft.EditorState} editorState
 * @return {Draft.EditorState}
 */
function onTab(event, editorState, tabSize) {
  event.preventDefault();
  tabSize = tabSize || DEFAULT_TAB_SIZE;

  var indentation;
  if (event.shiftKey) {
    var decreasedIndentation = decreaseIndentation(editorState, tabSize);

    indentation =
      decreasedIndentation !== undefined ? decreasedIndentation : editorState;
  } else {
    indentation = increaseIndentation(editorState, tabSize);
  }

  return indentation;
}

module.exports = onTab;
