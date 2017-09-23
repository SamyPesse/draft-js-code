var Draft = require('draft-js');
var getNewLine = require('./getNewLine');
var getLines = require('./getLines');
var getLineAnchorForOffset = require('./getLineAnchorForOffset');
var getIndentForLine = require('./getIndentForLine');

/**
 *  Insert a new line with right inden
 *
 * @param {SyntheticKeyboardEvent} event
 * @param {Draft.EditorState} editorState
 * @return {Draft.EditorState}
 */
function insertNewLine(editorState) {
  var contentState = editorState.getCurrentContent();
  var selection = editorState.getSelection();
  var startKey = selection.getStartKey();
  var startOffset = selection.getStartOffset();
  var currentBlock = contentState.getBlockForKey(startKey);
  var blockText = currentBlock.getText();

  var newContentState;

  // Detect newline separation
  var newLine = getNewLine(blockText);

  // Add or replace
  if (selection.isCollapsed()) {
    // Create line to insert with right indentation
    var lines = getLines(blockText, newLine);
    var currentLineIndex = getLineAnchorForOffset(
      blockText,
      startOffset,
      newLine
    ).getLine();
    var currentLine = lines.get(currentLineIndex);
    var lineToInsert = newLine + getIndentForLine(currentLine);

    newContentState = Draft.Modifier.insertText(
      contentState,
      selection,
      lineToInsert
    );
  } else {
    newContentState = Draft.Modifier.replaceText(
      contentState,
      selection,
      newLine
    );
  }

  var newEditorState = Draft.EditorState.push(
    editorState,
    newContentState,
    'insert-characters'
  );

  return Draft.EditorState.forceSelection(
    newEditorState,
    newContentState.getSelectionAfter()
  );
}

module.exports = insertNewLine;
