const {
  EditorState,
  ContentState,
  ContentBlock,
  SelectionState
} = require('draft-js');
const handleKeyCommand = require('../handleKeyCommand');

const toPlainText = editorState =>
  editorState.getCurrentContent().getPlainText();
const createWithText = text => {
  const contentState = ContentState.createFromText(text);
  return EditorState.createWithContent(contentState);
};

it('should delete indentation on backspace', () => {
  const initialText = 'hello    ';
  const currentContent = ContentState.createFromText(initialText);
  // "hello    "
  //          ^ cursor here
  const cursorAtEndOfLine = SelectionState.createEmpty(
    currentContent
      .getBlockMap()
      .first()
      .getKey()
  )
    .set('anchorOffset', initialText.length)
    .set('focusOffset', initialText.length);
  const editorState = EditorState.create({
    allowUndo: true,
    currentContent,
    selection: cursorAtEndOfLine
  });

  const result = handleKeyCommand(editorState, 'backspace');
  expect(toPlainText(result)).toEqual('hello');
});

it('should only delete one level of indentation', () => {
  const initialText = 'hello        ';
  const currentContent = ContentState.createFromText(initialText);
  // "hello        "
  //              ^ cursor here
  const cursorAtEndOfLine = SelectionState.createEmpty(
    currentContent
      .getBlockMap()
      .first()
      .getKey()
  )
    .set('anchorOffset', initialText.length)
    .set('focusOffset', initialText.length);
  const editorState = EditorState.create({
    allowUndo: true,
    currentContent,
    selection: cursorAtEndOfLine
  });

  const result = handleKeyCommand(editorState, 'backspace');
  expect(toPlainText(result)).toEqual('hello    ');
});

it('should delete indentation from the middle', () => {
  const initialText = 'hello            ';
  const currentContent = ContentState.createFromText(initialText);
  // "hello            "
  //              ^ cursor here
  const cursorAtEndOfLine = SelectionState.createEmpty(
    currentContent
      .getBlockMap()
      .first()
      .getKey()
  )
    .set('anchorOffset', initialText.length - 4)
    .set('focusOffset', initialText.length - 4);
  const editorState = EditorState.create({
    allowUndo: true,
    currentContent,
    selection: cursorAtEndOfLine
  });

  const result = handleKeyCommand(editorState, 'backspace');
  expect(toPlainText(result)).toEqual('hello        ');
});

it('should not do anything if anything other than an indentation is deleted', () => {
  const initialText = 'hello';
  const currentContent = ContentState.createFromText(initialText + '    ');
  // "hello    "
  //       ^ cursor here
  const cursorAfterWord = SelectionState.createEmpty(
    currentContent
      .getBlockMap()
      .first()
      .getKey()
  )
    .set('anchorOffset', initialText.length)
    .set('focusOffset', initialText.length);
  const editorState = EditorState.create({
    allowUndo: true,
    currentContent,
    selection: cursorAfterWord
  });

  expect(handleKeyCommand(editorState, 'backspace')).toEqual(undefined);
});

it('should not do anything on backspace if something is selected', () => {
  const initialText = 'hello';

  const currentContent = ContentState.createFromText(initialText);
  const selectInitialtext = SelectionState.createEmpty(
    currentContent
      .getBlockMap()
      .first()
      .getKey()
  );
  const editorState = EditorState.create({
    allowUndo: true,
    currentContent,
    // Focus the entire initial word
    selection: selectInitialtext.set('focusOffset', initialText.length)
  });

  expect(handleKeyCommand(editorState, 'backspace')).toEqual(undefined);
});

it('should skip handling when text beginning from the content-block beginning', () => {
  const firstBlock = new ContentBlock({
    key: 'a1',
    text: 'const a = 1;',
    type: 'unstyled'
  });
  const secondBlock = new ContentBlock({
    key: 'a2',
    text: 'function () {',
    type: 'code-block'
  });
  const currentContent = ContentState.createFromBlockArray([
    firstBlock,
    secondBlock
  ]);
  const selectSecondBlock = SelectionState.createEmpty(
    currentContent
      .getBlockMap()
      .last()
      .getKey()
  )
    .set('anchorOffset', 0)
    .set('focusOffset', 0);
  const editorState = EditorState.create({
    allowUndo: true,
    currentContent,
    selection: selectSecondBlock
  });

  const after = handleKeyCommand(editorState, 'backspace');
  expect(toPlainText(after)).toEqual(toPlainText(editorState));
});

it('should not do anything for any other command', () => {
  const editorState = createWithText('');
  expect(handleKeyCommand(editorState, 'enter')).toEqual(undefined);
});
