var Draft = require('draft-js');
var getIndentation = require('./getIndentation');

/**
 * Handle pressing tab in the editor
 *
 * @param {SyntheticKeyboardEvent} event
 * @param {Draft.EditorState} editorState
 * @return {Draft.EditorState}
 */
function handleTab(e, editorState) {
    e.preventDefault();

    var contentState = editorState.getCurrentContent();
    var selection    = editorState.getSelection();
    var startKey     = selection.getStartKey();
    var currentBlock = contentState.getBlockForKey(startKey);

    var indentation = getIndentation(currentBlock.getText())

    if (selection.isCollapsed()) {
        var newContentState = Draft.Modifier.insertText(
            contentState,
            selection,
            indentation
        );
        return Draft.EditorState.push(editorState, newContentState, 'insert-text');
    } else {
        var newContentState = Draft.Modifier.replaceText(
            contentState,
            selection,
            indentation
        );
        return Draft.EditorState.push(editorState, newContentState, 'insert-text');
    }

    return editorState;
}

module.exports = handleTab;
