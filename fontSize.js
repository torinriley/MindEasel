function changeTextSize(size) {
    const selectedTextField = document.querySelector('.text-field.selected');
    if (selectedTextField) {
        const contentEditable = selectedTextField.querySelector('.content-editable');
        let fontSize;
        switch(size) {
            case 'small':
                fontSize = '12px';
                break;
            case 'medium':
                fontSize = '16px';
                break;
            case 'large':
                fontSize = '20px';
                break;
            default:
                fontSize = '16px';
        }
        contentEditable.style.fontSize = fontSize;
    } else {
        alert("Please select a text field to change its font size.");
    }
}
