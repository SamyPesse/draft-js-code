# draft-js-code

[![NPM version](https://badge.fury.io/js/draft-js-code.svg)](http://badge.fury.io/js/draft-js-code)
[![Coverage Status](https://coveralls.io/repos/github/SamyPesse/draft-js-code/badge.svg?branch=master)](https://coveralls.io/github/SamyPesse/draft-js-code?branch=master)

`draft-js-code` is a collection of low-level utilities to make code block editing in DraftJS editors nicer.

<!-- If you're using `draft-js-plugins`, check out the [`draft-js-code-plugin`](https://github.com/withspectrum/draft-js-code-plugin) wrapper around this library. -->

It works well with [`draft-js-prism`](https://github.com/SamyPesse/draft-js-prism) or [`draft-js-prism-plugin`](https://github.com/withspectrum/draft-js-prism-plugin).

Demo: [samypesse.github.io/draft-js-code/](http://samypesse.github.io/draft-js-code/)

### Features

- [x] Indent with <kbd>TAB</kbd>
- [x] Insert new line with correct indentation with <kbd>ENTER</kbd>
- [x] Remove indentation with <kbd>DELETE</kbd>
- [ ] Remove indentation with <kdb>SHIFT+TAB</kbd> ([#6](https://github.com/SamyPesse/draft-js-code/issues/6))
- [ ] Handle input of pair characters like `()`, `[]`, `{}`, `""`, etc. ([#3](https://github.com/SamyPesse/draft-js-code/issues/3))

### Installation

```
$ npm install draft-js-code --save
```

### API

##### `CodeUtils.hasSelectionInBlock(editorState)`

Returns true if user is editing a code block. You should call this method to encapsulate all other methods when limiting code edition behaviour to `code-block`.

##### `CodeUtils.handleKeyCommand(editorState, command)`

Handle key command for code blocks, returns a new `EditorState` or `null`.

##### `CodeUtils.onTab(e, editorState)`

Handle user pressing tab, to insert indentation, it returns a new `EditorState`.

##### `CodeUtils.handleReturn(e, editorState)`

Handle user pressing return, to insert a new line inside the code block, it returns a new `EditorState`.


### Usage

```js
import React from 'react';
import Draft from 'draft-js';
import CodeUtils from 'draft-js-code';

class Editor extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      editorState: Draft.EditorState.createEmpty()
    };
  }

  onChange = (editorState) => {
    this.setState({
      editorState
    })
  }

  handleKeyCommand = (command) => {
    const { editorState } = this.state;
    let newState;

    if (CodeUtils.hasSelectionInBlock(editorState)) {
      newState = CodeUtils.handleKeyCommand(editorState, command);
    }

    if (!newState) {
      newState = RichUtils.handleKeyCommand(editorState, command);
    }

    if (newState) {
      this.onChange(newState);
      return 'handled';
    }
    return 'not-handled';
  }

  keyBindingFn = (evt) => {
    const { editorState } = this.state;
    if (!CodeUtils.hasSelectionInBlock(editorState)) return Draft.getDefaultKeyBinding(evt);

    const command = CodeUtils.getKeyBinding(evt);

    return command || Draft.getDefaultKeyBinding(evt);
  }

  handleReturn = (evt) => {
    const { editorState } = this.state;
    if (!CodeUtils.hasSelectionInBlock(editorState)) return 'not-handled';

    this.onChange(CodeUtils.handleReturn(evt, editorState));
    return 'handled';
  }

  onTab = (evt) => {
    const { editorState } = this.state;
    if (!CodeUtils.hasSelectionInBlock(editorState)) return 'not-handled';

    this.onChange(CodeUtils.onTab(evt, editorState));
    return 'handled';
  }

  render() {
    return (
      <Draft.Editor
        editorState={this.state.editorState}
        onChange={this.onChange}
        keyBindingFn={this.keyBindingFn}
        handleKeyCommand={this.handleKeyCommand}
        handleReturn={this.handleReturn}
        onTab={this.onTab}
      />
    );
  }
}
```
