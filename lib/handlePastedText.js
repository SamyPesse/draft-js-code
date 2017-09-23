var Draft = require('draft-js');
var insertNewLine = require('./insertNewLine');

/**
 *  We split code blocks only if user pressed Cmd+Enter
 *
 * @param {SyntheticKeyboardEvent} event
 * @param {Draft.EditorState} editorState
 * @return {Draft.EditorState}
 */
function handlePastedText(editorState, text, html) {
    var contentState = editorState.getCurrentContent();
    var selection    = editorState.getSelection();

    // Command+Return: As usual, split blocks
    var newContentState = Draft.Modifier.replaceText(contentState, selection, text);
    return Draft.EditorState.push(editorState, newContentState, 'insert-characters');
}

module.exports = handlePastedText;
