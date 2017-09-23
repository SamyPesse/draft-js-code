var Draft = require('draft-js');
var endsWith = require('ends-with');

var getNewLine = require('./getNewLine');
var getIndentation = require('./getIndentation');
var getLines = require('./getLines');
var getLineAnchorForOffset = require('./getLineAnchorForOffset');

/**
 * Remove last indentation before cursor, return undefined if no modification is done
 *
 * @param {Draft.EditorState} editorState
 * @return {Draft.EditorState|undefined}
 */
function removeIndent(editorState) {
  var contentState = editorState.getCurrentContent();
  var selection = editorState.getSelection();

  if (!selection.isCollapsed()) {
    return;
  }

  var startKey = selection.getStartKey();
  var startOffset = selection.getStartOffset();
  var currentBlock = contentState.getBlockForKey(startKey);
  var blockText = currentBlock.getText();

  // Detect newline separator and indentation
  var newLine = getNewLine(blockText);
  var indent = getIndentation(blockText);

  // Get current line
  var lines = getLines(blockText, newLine);
  var lineAnchor = getLineAnchorForOffset(blockText, startOffset, newLine);

  var currentLine = lines.get(lineAnchor.getLine());
  var beforeSelection = currentLine.slice(0, lineAnchor.getOffset());

  // If the line before selection ending with the indentation?
  if (!endsWith(beforeSelection, indent)) {
    return;
  }

  // Remove indent
  var beforeIndentOffset = startOffset - indent.length;
  var rangeToRemove = selection.merge({
    focusKey: startKey,
    focusOffset: beforeIndentOffset,
    anchorKey: startKey,
    anchorOffset: startOffset,
    isBackward: true
  });

  var newContentState = Draft.Modifier.removeRange(
    contentState,
    rangeToRemove,
    'backward'
  );
  var newEditorState = Draft.EditorState.push(
    editorState,
    newContentState,
    'remove-range'
  );

  return Draft.EditorState.forceSelection(
    newEditorState,
    newContentState.getSelectionAfter()
  );
}

module.exports = removeIndent;
