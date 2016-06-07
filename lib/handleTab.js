var Draft = require('draft-js');

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

    if (selection.isCollapsed()) {
        var newContentState = Draft.Modifier.insertText(
            contentState,
            selection,
            '    '
        );
        return Draft.EditorState.push(editorState, newContentState, 'insert-text');
    }

    return editorState;
}

module.exports = handleTab;
