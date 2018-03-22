var Draft = require('draft-js');
var { SelectionState } = require('draft-js');

var getNewLine = require('./getNewLine');
var getIndentation = require('./getIndentation');
var getLines = require('./getLines');
var getLineAnchorForOffset = require('./getLineAnchorForOffset');
var getStringLengthIncludingLineAnchor = require('./getStringLengthIncludingLineAnchor');

/**
 * Remove last indentation before cursor, return undefined if no modification is done
 *
 * @param {Draft.EditorState} editorState
 * @return {Draft.EditorState|undefined}
 */
function decreaseIndentation(editorState, tabSize) {
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
  if (tabSize === null) {
    tabSize = indent.length;
  }
  var tab = ' '.repeat(tabSize);

  // Get current line
  var lines = getLines(blockText, newLine);
  var lineAnchor = getLineAnchorForOffset(blockText, startOffset, newLine);

  var currentLine = lines.get(lineAnchor.getLine());

  var lineAnchorLimit = getStringLengthIncludingLineAnchor(lines, lineAnchor);

  // TODO: If the line starts with fewer spaces than the tabSize, remove them?
  // If the line doesn't start with an 'indent', ignore it. (there's no indent to remove).
  if (currentLine.slice(0, tabSize) !== tab) {
    return;
  }

  var startOfLineAnchor = lineAnchorLimit - currentLine.length;

  // Remove indent
  var rangeToRemove = selection.merge({
    focusKey: startKey,
    focusOffset: startOfLineAnchor,
    anchorKey: startKey,
    anchorOffset: startOfLineAnchor + tabSize,
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
    anchorOffset: startOffset - tabSize,
    focusKey: newContentDefaultSelectionState.anchorKey,
    focusOffset: startOffset - tabSize,
    isBackward: false
  });

  return Draft.EditorState.forceSelection(newEditorState, updateSelection);
}

module.exports = decreaseIndentation;
