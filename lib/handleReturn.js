var Draft = require('draft-js');
var getNewLine = require('./getNewLine');
var getLines = require('./getLines');
var getLineForOffset = require('./getLineForOffset');
var getIndentForLine = require('./getIndentForLine');

/**
 *  Don't split code blocks when user pressed Enter, insert a "\n"
 *
 * @param {SyntheticKeyboardEvent} event
 * @param {Draft.EditorState} editorState
 * @return {Draft.EditorState}
 */
function handleReturn(e, editorState) {
    var contentState = editorState.getCurrentContent();
    var selection    = editorState.getSelection();
    var startKey     = selection.getStartKey();
    var startOffset  = selection.getStartOffset();
    var currentBlock = contentState.getBlockForKey(startKey);
    var blockText    = currentBlock.getText();

    var newContentState;

    // Detect newline separation
    var newLine = getNewLine(blockText);

    // Add or replace
    if (selection.isCollapsed()) {
        // Create line to insert with right indentation
        var lines = getLines(blockText, newLine);
        var currentLineIndex = getLineForOffset(blockText, startOffset, newLine);
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

    return Draft.EditorState.push(editorState, newContentState, 'insert-text');
}

module.exports = handleReturn;
