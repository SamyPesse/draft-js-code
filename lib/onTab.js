var Draft = require('draft-js');
var getIndentation = require('./utils/getIndentation');

// TODO: tab should complete indentation instead of just inserting one

/**
 * Handle pressing tab in the editor
 *
 * @param {SyntheticKeyboardEvent} event
 * @param {Draft.EditorState} editorState
 * @return {Draft.EditorState}
 */
function onTab(e, editorState) {
  e.preventDefault();

  var contentState = editorState.getCurrentContent();
  var selection = editorState.getSelection();
  var startKey = selection.getStartKey();
  var currentBlock = contentState.getBlockForKey(startKey);

  var indentation = getIndentation(currentBlock.getText());
  var newContentState;

  if (selection.isCollapsed()) {
    newContentState = Draft.Modifier.insertText(
      contentState,
      selection,
      indentation
    );
  } else {
    newContentState = Draft.Modifier.replaceText(
      contentState,
      selection,
      indentation
    );
  }

  return Draft.EditorState.push(
    editorState,
    newContentState,
    'insert-characters'
  );
}

module.exports = onTab;
