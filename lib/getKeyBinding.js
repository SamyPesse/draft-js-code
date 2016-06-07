var TAB_KEYCODE = 9;

/**
 * Return command for a keyboard event
 *
 * @param {SyntheticKeyboardEvent} event
 * @return {String}
 */
function getKeyBinding(e) {
    if (e.keyCode === TAB_KEYCODE) {
        return 'tab';
    }
}

module.exports = getKeyBinding;
