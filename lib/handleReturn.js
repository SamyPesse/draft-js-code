var Draft = require('draft-js');

/**
 *  Don't split code blocks when user pressed Enter, insert a "\n"
 *
 * @param {SyntheticKeyboardEvent} event
 * @param {Draft.EditorState} editorState
 * @return {Draft.EditorState}
 */
function handleReturn(e, editorState) {
    var contentState = editorState.getCurrentContent();
    var selection = editorState.getSelection();

    contentState = Draft.Modifier.insertText(contentState, selection, '\n');
    editorState = Draft.EditorState.push(editorState, contentState, 'insert-line');

    return editorState;
}

module.exports = handleReturn;
