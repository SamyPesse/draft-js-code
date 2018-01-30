var Draft = require('draft-js');
var getIndentation = require('./getIndentation');

function increaseIndentation(editorState, tabSize) {
  var contentState = editorState.getCurrentContent();
  var selection = editorState.getSelection();
  var startKey = selection.getStartKey();
  var currentBlock = contentState.getBlockForKey(startKey);

  var indentation;
  if (tabSize !== null) {
    indentation = ' '.repeat(tabSize);
  } else {
    indentation = getIndentation(currentBlock.getText());
  }

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

module.exports = increaseIndentation;
