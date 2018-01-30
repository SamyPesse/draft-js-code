const { EditorState, ContentState, SelectionState } = require('draft-js');
const onTab = require('../onTab');

const toPlainText = editorState =>
  editorState.getCurrentContent().getPlainText();
const createWithText = text => {
  const contentState = ContentState.createFromText(text);
  return EditorState.createWithContent(contentState);
};

const tabs = times => '    '.repeat(times || 1);

it('should prevent the default event behavior', () => {
  const preventDefault = jest.fn();
  const evt = { preventDefault };
  const before = EditorState.createEmpty();

  onTab(evt, before);
  expect(preventDefault).toHaveBeenCalled();
});

it('should insert a tab when shift is not pressed', () => {
  const evt = { preventDefault: jest.fn() };
  const initialText = '';
  const before = createWithText(initialText);
  const after = onTab(evt, before);

  expect(toPlainText(before)).toEqual(initialText);
  expect(toPlainText(after)).toEqual(tabs(1));
});

it('should insert a two-spaced tab when the tab size is set to two', () => {
  const evt = { preventDefault: jest.fn() };
  const initialText = '';
  const before = createWithText(initialText);
  const after = onTab(evt, before, 2);

  expect(toPlainText(before)).toEqual(initialText);
  expect(toPlainText(after)).toEqual('  ');
});

it('should remove a tab on a single line string when shift is pressed', () => {
  const evt = { preventDefault: jest.fn(), shiftKey: true };
  const initialText = tabs(1) + 'hello';
  const before = createWithText(initialText);
  const after = onTab(evt, before);

  expect(toPlainText(before)).toEqual(initialText);
  expect(toPlainText(after)).toEqual('hello');
});

it('should remove a tab from a multi line string when shift is pressed', () => {
  const evt = { preventDefault: jest.fn(), shiftKey: true };
  const initialText =
    'Multi-Line Text\n' +
    tabs(1) +
    '- tabbed line one\n' +
    tabs(1) +
    '- tabbed line two';
  const before = createWithText(initialText);
  const after = onTab(evt, before);

  const expectedText =
    'Multi-Line Text\n' +
    tabs(0) +
    '- tabbed line one\n' +
    tabs(1) +
    '- tabbed line two';

  expect(toPlainText(before)).toEqual(initialText);
  expect(toPlainText(after)).toEqual(expectedText);
});

it('should add a tab to an existing tab when shift is not pressed', () => {
  const evt = { preventDefault: jest.fn() };
  const initialText = tabs(1);
  const before = createWithText(initialText);
  const after = onTab(evt, before);

  expect(toPlainText(before)).toEqual(initialText);
  expect(toPlainText(after)).toEqual(initialText + tabs(1));
});

it('should remove a tab from an existing tab when shift is pressed', () => {
  const evt = { preventDefault: jest.fn(), shiftKey: true };
  const initialText = tabs(1);
  const before = createWithText(initialText);
  const after = onTab(evt, before);

  expect(toPlainText(before)).toEqual(initialText);
  expect(toPlainText(after)).toEqual('');
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

  const after = onTab(evt, before);
  expect(toPlainText(before)).toEqual(initialText);
  expect(toPlainText(after)).toEqual(tabs(1));
});
