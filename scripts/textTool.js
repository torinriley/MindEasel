export function createTextField(x, y) {
    const textField = document.createElement('div');
    textField.className = 'text-field';
    textField.style.top = `${y}px`;
    textField.style.left = `${x}px`;
    textField.style.width = '150px';
    textField.style.height = '50px';
    textField.id = `text-${Date.now()}`;

    const contentEditable = document.createElement('div');
    contentEditable.className = 'content-editable';
    contentEditable.contentEditable = true;
    contentEditable.textContent = 'Type here...';
    contentEditable.style.fontSize = '16px';
    contentEditable.style.color = 'grey'; 

    contentEditable.addEventListener('focus', () => {
        if (contentEditable.textContent === 'Type here...') {
            contentEditable.textContent = '';
            contentEditable.style.color = 'black';
        }
    });

    contentEditable.addEventListener('blur', () => {
        if (contentEditable.textContent.trim() === '') {
            contentEditable.textContent = 'Type here...';
            contentEditable.style.color = 'grey'; 
        }
        saveTextContent(textField.id, contentEditable.textContent);
    });

    textField.appendChild(contentEditable);

    const resizeHandles = ['top-left', 'top-right', 'bottom-left', 'bottom-right'];
    resizeHandles.forEach(handle => {
        const resizeHandle = document.createElement('div');
        resizeHandle.className = `resize-handle ${handle}`;
        textField.appendChild(resizeHandle);
    });

    document.getElementById('canvas').appendChild(textField);

    return textField;
}


export function changeFontSize(size) {
    const selectedTextField = document.querySelector('.text-field.selected .content-editable');
    if (selectedTextField) {
        selectedTextField.style.fontSize = size;
        saveTextContent(selectedTextField.closest('.text-field').id, selectedTextField.textContent);
    }
}

export function changeFontType(font) {
    const selectedTextField = document.querySelector('.text-field.selected .content-editable');
    if (selectedTextField) {
        selectedTextField.style.fontFamily = font;
        saveTextContent(selectedTextField.closest('.text-field').id, selectedTextField.textContent);
    }
}
