/**
 * Return true if selection is inside a code block
 *
 * @param {Draft.EditorState} editorState
 * @return {Boolean}
 */
function hasSelectionInBlock(editorState) {
  var selection = editorState.getSelection();
  var contentState = editorState.getCurrentContent();
  var startKey = selection.getStartKey();
  var currentBlock = contentState.getBlockForKey(startKey);

  return currentBlock.getType() === 'code-block';
}

module.exports = hasSelectionInBlock;
