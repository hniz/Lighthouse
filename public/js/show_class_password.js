(function ($) {
    const showClassButton = $('#show-password-button');
    const classField = $('#class-password')[0];
    let shown = false;
    showClassButton.on('click', (event) => {
        event.preventDefault();
        if (shown) {
            classField.type = 'password';
            shown = false;
            showClassButton.text('Show password');
        } else {
            classField.type = 'input';
            shown = true;
            showClassButton.text('Hide password');
        }
    });
})(window.jQuery);
