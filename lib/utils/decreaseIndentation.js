var Draft = require('draft-js');
var { SelectionState } = require('draft-js');
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
function decreaseIndentation(editorState) {
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

  // If the line doesn't start with an 'indent', ignore it. (there's no indent to remove).
  if (currentLine.slice(0, indent.length) !== indent) {
    return;
  }
  // Remove indent
  var beforeIndentOffset = indent.length;
  var rangeToRemove = selection.merge({
    focusKey: startKey,
    focusOffset: 0,
    anchorKey: startKey,
    anchorOffset: indent.length,
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

  // Restore the previous cursor position.
  var newContentDefaultSelectionState = newContentState.getSelectionAfter();
  var updateSelection = new SelectionState({
    anchorKey: newContentDefaultSelectionState.anchorKey,
    anchorOffset: startOffset - indent.length,
    focusKey: newContentDefaultSelectionState.anchorKey,
    focusOffset: startOffset - indent.length,
    isBackward: false
  });

  return Draft.EditorState.forceSelection(newEditorState, updateSelection);
}

module.exports = decreaseIndentation;
