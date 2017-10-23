const {
  Modifier,
  EditorState,
  ContentState,
  SelectionState
} = require('draft-js');
const handleReturn = require('../handleReturn');

const toPlainText = editorState =>
  editorState.getCurrentContent().getPlainText();
const createWithText = text => {
  const contentState = ContentState.createFromText(text);
  return EditorState.createWithContent(contentState);
};

it('should insert a new line', () => {
  const initialText = '';
  const before = createWithText(initialText);
  const after = handleReturn({}, before);

  expect(toPlainText(before)).toEqual(initialText);
  expect(toPlainText(after)).toEqual(initialText + '\n');
});

it('should insert a new line at the same level of indentation', () => {
  const initialText = "    const a = 'b';";
  const currentContent = ContentState.createFromText(initialText);
  const afterLastCharacter = SelectionState.createEmpty(
    currentContent
      .getBlockMap()
      .first()
      .getKey()
  )
    .set('anchorOffset', initialText.length)
    .set('focusOffset', initialText.length);
  const before = EditorState.create({
    allowUndo: true,
    currentContent,
    // Jump selection to the end of the line
    selection: afterLastCharacter
  });
  const after = handleReturn({}, before);

  expect(toPlainText(before)).toEqual(initialText);
  expect(toPlainText(after)).toEqual(initialText + '\n    ');
});

it('should replace selected content with a new line', () => {
  const initialText = 'hello';
  const currentContent = ContentState.createFromText(initialText);
  const selectInitialtext = SelectionState.createEmpty(
    currentContent
      .getBlockMap()
      .first()
      .getKey()
  );
  const before = EditorState.create({
    allowUndo: true,
    currentContent,
    // Focus the entire initial word
    selection: selectInitialtext.set('focusOffset', initialText.length)
  });

  const after = handleReturn({}, before);
  expect(toPlainText(before)).toEqual(initialText);
  expect(toPlainText(after)).toEqual('\n');
});
