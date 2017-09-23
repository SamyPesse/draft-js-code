const { List, Map } = require('immutable');
const {
  ContentBlock,
  ContentState,
  EditorState,
  CharacterMetadata
} = require('draft-js');
const hasSelectionInBlock = require('../hasSelectionInBlock');

const text = 'const a = "b";';
const textBlock = new ContentBlock({
  key: 'texty-blockey',
  type: 'unstyled',
  text,
  characterList: new List(text.split('').map(char => new CharacterMetadata())),
  depth: 0,
  data: new Map()
});

const codeBlock = new ContentBlock({
  key: 'codey-blockey',
  type: 'code-block',
  text,
  characterList: new List(text.split('').map(char => new CharacterMetadata())),
  depth: 0,
  data: new Map()
});

it('should return true if the selected block is a "code-block"', () => {
  const contentState = ContentState.createFromBlockArray([codeBlock]);
  const editorState = EditorState.createWithContent(contentState);

  expect(hasSelectionInBlock(editorState)).toEqual(true);
});

it('should return true if there is multiple "code-block"s and one is selected', () => {
  const text = 'const a = "b";';
  const contentState = ContentState.createFromBlockArray([
    codeBlock,
    codeBlock
  ]);
  const editorState = EditorState.createWithContent(contentState);

  expect(hasSelectionInBlock(editorState)).toEqual(true);
});

it('should return false if there is no "code-block"', () => {
  const text = 'const a = "b";';
  const contentState = ContentState.createFromBlockArray([textBlock]);
  const editorState = EditorState.createWithContent(contentState);

  expect(hasSelectionInBlock(editorState)).toEqual(false);
});

it('should return false if the selected block is not a "code-block"', () => {
  const text = 'const a = "b";';
  const contentState = ContentState.createFromBlockArray([
    textBlock,
    codeBlock
  ]);
  const editorState = EditorState.createWithContent(contentState);

  expect(hasSelectionInBlock(editorState)).toEqual(false);
});
