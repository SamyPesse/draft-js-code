const { EditorState, ContentState, SelectionState } = require('draft-js');
const handleTab = require('../handleTab');

const toPlainText = editorState =>
  editorState.getCurrentContent().getPlainText();
const createWithText = text => {
  const contentState = ContentState.createFromText(text);
  return EditorState.createWithContent(contentState);
};

const tabs = times => '    '.repeat(times || 1);

it('should insert a tab', () => {
  const evt = { preventDefault: jest.fn() };
  const initialText = '';
  const before = createWithText(initialText);
  const after = handleTab(evt, before);

  expect(toPlainText(before)).toEqual(initialText);
  expect(toPlainText(after)).toEqual(tabs(1));
});

it('should prevent the default event behavior', () => {
  const preventDefault = jest.fn();
  const evt = { preventDefault };
  const before = EditorState.createEmpty();

  handleTab(evt, before);
  expect(preventDefault).toHaveBeenCalled();
});

it('should add a tab to an existing tab', () => {
  const evt = { preventDefault: jest.fn() };
  const initialText = tabs(1);
  const before = createWithText(initialText);
  const after = handleTab(evt, before);

  expect(toPlainText(before)).toEqual(initialText);
  expect(toPlainText(after)).toEqual(initialText + tabs(1));
});

it('should replace selected content with the tab', () => {
  const evt = { preventDefault: jest.fn() };
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

  const after = handleTab(evt, before);
  expect(toPlainText(before)).toEqual(initialText);
  expect(toPlainText(after)).toEqual(tabs(1));
});

it('should match the indentation of the previous line', () => {
  const evt = { preventDefault: jest.fn() };
  const initialText = `${tabs(2)}const a = 'b';\n`;

  const currentContent = ContentState.createFromText(initialText);
  // "        const a = 'b'
  //  "
  // ^ cursor here (on second line/in second block)
  const cursorOnSecondLine = SelectionState.createEmpty(
    currentContent
      .getBlockMap()
      .last()
      .getKey()
  );
  const before = EditorState.create({
    allowUndo: true,
    currentContent,
    // Focus the entire initial word
    selection: cursorOnSecondLine
  });

  const after = handleTab(evt, before);
  expect(toPlainText(before)).toEqual(initialText);
  expect(toPlainText(after)).toEqual(initialText + tabs(2));
});
