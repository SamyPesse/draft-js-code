var Draft = require('draft-js');
var insertNewLine = require('./insertNewLine');

/**
 *  We split code blocks only if user pressed Cmd+Enter
 *
 * @param {SyntheticKeyboardEvent} event
 * @param {Draft.EditorState} editorState
 * @return {Draft.EditorState}
 */
function handleReturn(e, editorState) {
    // Command+Return: As usual, split blocks
    var selection = editorState.getSelection();
    if (selection.isCollapsed() && Draft.KeyBindingUtil.hasCommandModifier(e)) {
        editorState = splitBlock(editorState);
        editorState = setUnstyled(editorState);
        return editorState;
    }

    return insertNewLine(editorState);
}

function splitBlock(editorState) {
    var contentState = editorState.getCurrentContent();
    var selection = editorState.getSelection();
    var newContentState = Draft.Modifier.splitBlock(contentState, selection);
    editorState = Draft.EditorState.push(editorState, newContentState, 'split-block');
    return editorState;
}

function setUnstyled(editorState) {
    var contentState = editorState.getCurrentContent();
    var selection = editorState.getSelection();
    var newContentState = Draft.Modifier.setBlockType(contentState, selection, 'unstyled');
    editorState = Draft.EditorState.push(editorState, newContentState, 'split-block');
    return editorState;
}

module.exports = handleReturn;
