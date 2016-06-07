var TAB_KEYCODE = 9;

/**
 * Return command for a keyboard event
 *
 * @param {SyntheticKeyboardEvent} event
 * @return {String}
 */
function getKeyBinding(e) {
    console.log('press', e.keyCode);

    if (e.keyCode === TAB_KEYCODE) {
        console.log('pressed tab');
        return 'tab';
    }
}

module.exports = getKeyBinding;
