export function createTextField(x, y) {
    const textField = document.createElement('div');
    textField.className = 'text-field';
    textField.style.top = `${y}px`;
    textField.style.left = `${x}px`;
    textField.style.width = '150px';
    textField.style.height = '50px';
    textField.id = `text-${Date.now()}`; // Assign a unique ID

    const contentEditable = document.createElement('div');
    contentEditable.className = 'content-editable';
    contentEditable.contentEditable = true;
    contentEditable.textContent = 'Type here...';

    contentEditable.addEventListener('focus', function handleFocus() {
        if (contentEditable.textContent === 'Type here...') {
            contentEditable.textContent = '';
            contentEditable.removeEventListener('focus', handleFocus);
        }
    });

    contentEditable.addEventListener('blur', () => {
        saveTextContent(textField.id, contentEditable.textContent); // Save the text content on blur
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

function saveTextContent(elementId, text) {
    // Save text content for undo/redo or other operations
}
