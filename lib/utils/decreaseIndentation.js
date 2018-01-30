var Draft = require('draft-js');
var { SelectionState } = require('draft-js');

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
  console.log('default indentation: ', getIndentation('').length);
  console.log('start offset: ', startOffset);
  console.log('newline ', newLine);
  console.log('line ', currentLine);
  console.log('line anchor offset: ', lineAnchor.getOffset());
  console.log('line anchor index: ', lineAnchor.getLine());

  var lineAnchorLimit = 0;
  var lineIndex = 0;
  while (lineIndex <= lineAnchor.getLine()) {
    var currentLine = lines.get(lineIndex);

    // Newline characters are not included in string.length.
    var newlineOffset = lineIndex === lineAnchor.getLine() ? 0 : 1;

    lineAnchorLimit += currentLine.length + newlineOffset;

    lineIndex++;
  }
  console.log('la limit: ', lineAnchorLimit);

  // If the line doesn't start with an 'indent', ignore it. (there's no indent to remove).
  if (currentLine.slice(0, indent.length) !== indent) {
    return;
  }

  var startOfLineAnchor = lineAnchorLimit - currentLine.length;
  console.log('start of line anchor: ', startOfLineAnchor);

  // Remove indent
  var rangeToRemove = selection.merge({
    focusKey: startKey,
    focusOffset: startOfLineAnchor,
    anchorKey: startKey,
    anchorOffset: startOfLineAnchor + indent.length,
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
