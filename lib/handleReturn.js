var Draft = require('draft-js');
var insertNewLine = require('./insertNewLine');

/**
 *  We split code blocks only if we are on the last line
 *
 * @param {SyntheticKeyboardEvent} event
 * @param {Draft.EditorState} editorState
 * @return {Draft.EditorState}
 */
function handleReturn(e, editorState) {
    var contentState = editorState.getCurrentContent();
    var selection    = editorState.getSelection();

    // Split block only if classic return
    if (selection.isCollapsed() && !e.shiftKey) {
        var startKey     = selection.getStartKey();
        var startOffset  = selection.getStartOffset();
        var currentBlock = contentState.getBlockForKey(startKey);
        var blockText    = currentBlock.getText();

        // Are we at the end of the block
        if (startOffset !== blockText.length) {
            return insertNewLine(editorState);
        }

        // As usual, split blocks
        var newContentState = Draft.Modifier.splitBlock(contentState, selection);
        return Draft.EditorState.push(editorState, newContentState, 'split-block');
    }


    return insertNewLine(editorState);
}

module.exports = handleReturn;
