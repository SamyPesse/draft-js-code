# draft-js-code

[![NPM version](https://badge.fury.io/js/draft-js-code.svg)](http://badge.fury.io/js/draft-js-code)
[![Build Status](https://travis-ci.org/SamyPesse/draft-js-code.svg?branch=master)](https://travis-ci.org/SamyPesse/draft-js-code)

`draft-js-code` is a collection of utilities to make code blocks edition easy in DraftJS. It works well with [draft-js-prism](https://github.com/SamyPesse/draft-js-prism).

Demo: [samypesse.github.io/draft-js-code/](http://samypesse.github.io/draft-js-code/)

### Features

- [x] Insert indent when pressing <kbd>TAB</kbd>
- [x] Insert new line in block with right indentation when pressing <kbd>ENTER</kbd>
- [x] Remove indentation when pressing <kbd>DELETE</kbd>
- [x] Pressing <kbd>TAB</kbd> on last line, split the block
- [x] Exit code blocks when pressing <kbd>ENTER + Command</kbd>

### Installation

```
$ npm install draft-js-code --save
```

### API

##### `CodeUtils.hasSelectionInBlock(editorState)`

Returns true if user is editing a code block. You should call this method to encapsulate all other methods when limiting code edition behaviour to `code-block`.

##### `CodeUtils.handleKeyCommand(editorState, command)`

Handle key command for code blocks, returns a new `EditorState` or `null`.

##### `CodeUtils.handleTab(e, editorState)`

Handle user pressing tab, to insert indentation, it returns a new `EditorState`.

##### `CodeUtils.handleReturn(e, editorState)`

Handle user pressing return, to insert a new line inside the code block, it returns a new `EditorState`.


### Usage

```js
var React = require('react');
var ReactDOM = require('react-dom');
var Draft = require('draft-js');
var CodeUtils = require('draft-js-code');

var Editor = React.createClass({
    getInitialState: function() {
        return {
            editorState: Draft.EditorState.createEmpty()
        };
    },

    onChange: function(editorState) {
        this.setState({
            editorState: editorState
        });
    },

    handleKeyCommand: function(command) {
        var newState;

        if (CodeUtils.hasSelectionInBlock(editorState)) {
            newState = CodeUtils.handleKeyCommand(editorState, command);
        }

        if (!newState) {
            newState = Draft.RichUtils.handleKeyCommand(editorState, command);
        }

        if (newState) {
            this.onChange(newState);
            return true;
        }
        return false;
    },

    keyBindingFn: function(e) {
        var editorState = this.state.editorState;
        var command;

        if (CodeUtils.hasSelectionInBlock(editorState)) {
            command = CodeUtils.getKeyBinding(e);
        }
        if (command) {
            return command;
        }

        return Draft.getDefaultKeyBinding(e);
    },

    handleReturn: function(e) {
        var editorState = this.state.editorState;

        if (!CodeUtils.hasSelectionInBlock(editorState)) {
            return;
        }

        this.onChange(
            CodeUtils.handleReturn(e, editorState)
        );
        return true;
    },

    handleTab: function(e) {
        var editorState = this.state.editorState;

        if (!CodeUtils.hasSelectionInBlock(editorState)) {
            return;
        }

        this.onChange(
            CodeUtils.handleTab(e, editorState)
        );
    },

    render: function() {
        return <Draft.Editor
            editorState={this.state.editorState}
            onChange={this.onChange}
            keyBindingFn={this.keyBindingFn}
            handleKeyCommand={this.handleKeyCommand}
            handleReturn={this.handleReturn}
            onTab={this.handleTab}
        />;
    }
});
```
