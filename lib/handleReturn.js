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
    var contentState = editorState.getCurrentContent();
    var selection    = editorState.getSelection();

    // Command+Return: As usual, split blocks
    if (selection.isCollapsed() && Draft.KeyBindingUtil.hasCommandModifier(e)) {
        var newContentState = Draft.Modifier.splitBlock(contentState, selection);
        return Draft.EditorState.push(editorState, newContentState, 'split-block');
    }


    return insertNewLine(editorState);
}

module.exports = handleReturn;
