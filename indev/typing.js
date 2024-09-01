const canvasContainer = document.getElementById('canvas-container');
const canvas = document.getElementById('canvas');
const textTool = document.getElementById('text-tool');

let currentTool = null;
let isResizing = false;
let isSelecting = false; // Start in none mode by default
let currentTextField = null;
let isPanning = false;
let scale = 1;
let panX = 0;
let panY = 0;

// Activate text tool
textTool.addEventListener('click', () => {
    currentTool = 'text';
    isSelecting = false;
    clearSelection();
});

// Handle keyboard events for formatting
document.addEventListener('keydown', (event) => {
    if (event.metaKey || event.ctrlKey) {
        let command = null;
        switch (event.key.toLowerCase()) {
            case 'b':
                command = 'bold';
                break;
            case 'i':
                command = 'italic';
                break;
            case 'u':
                command = 'underline';
                break;
        }

        if (command && currentTextField && !isSelecting) {
            event.preventDefault();
            applyTextFormatting(command);
        }
    }

    // Handle delete or backspace for removing text fields
    if ((event.key === 'Delete' || event.key === 'Backspace') && !document.activeElement.isContentEditable) {
        const selectedFields = document.querySelectorAll('.text-field.selected');
        selectedFields.forEach(field => {
            field.remove();
        });
    }

    // Handle escape key to exit all modes (None mode)
    if (event.key === 'Escape') {
        clearSelection();
        exitAllModes();
    }
});

// Handle single-click to enter selection mode
canvas.addEventListener('click', (e) => {
    const selectedField = e.target.closest('.text-field');
    
    if (currentTool === 'text' && !isSelecting && !currentTextField) {
        createTextField((e.clientX - panX) / scale, (e.clientY - panY) / scale);
    } else if (selectedField) {
        selectTextField(selectedField); // Enter selection mode
    } else {
        clearSelection();
        enterSelectMode(); // Enter selection mode when clicking outside of a text box
    }
});

// Handle double-click to enter typing mode
canvas.addEventListener('dblclick', (e) => {
    const selectedField = e.target.closest('.text-field');
    if (selectedField) {
        enterTypingMode(selectedField);
    }
});

// Create a new text field
function createTextField(x, y) {
    const textField = document.createElement('div');
    textField.className = 'text-field';
    textField.style.top = `${y}px`;
    textField.style.left = `${x}px`;
    textField.style.width = '150px';
    textField.style.height = '50px';

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
        // Always enter selection mode when losing focus
        if (!isResizing) {
            enterSelectMode();
        }
    });

    textField.appendChild(contentEditable);

    const resizeHandles = ['top-left', 'top-right', 'bottom-left', 'bottom-right'];
    resizeHandles.forEach(handle => {
        const resizeHandle = document.createElement('div');
        resizeHandle.className = `resize-handle ${handle}`;
        textField.appendChild(resizeHandle);
    });

    canvas.appendChild(textField);
    currentTextField = textField;

    enableResize(textField);
    enableDrag(textField);

    selectTextField(textField);
    contentEditable.focus();
}

// Enter selection mode
function enterSelectMode() {
    isSelecting = true;
    currentTool = null;
    if (currentTextField) {
        const contentEditable = currentTextField.querySelector('.content-editable');
        contentEditable.contentEditable = false;
        showResizeHandles(currentTextField);
    }
}

// Enter typing mode
function enterTypingMode(element) {
    clearSelection();
    const contentEditable = element.querySelector('.content-editable');
    contentEditable.contentEditable = true;
    contentEditable.focus();
    hideResizeHandles(element);
    isSelecting = false; // Exit selection mode
}

// Clear selection and exit selection mode
function clearSelection() {
    const selectedFields = document.querySelectorAll('.text-field.selected');
    selectedFields.forEach(field => {
        field.classList.remove('selected');
        const contentEditable = field.querySelector('.content-editable');
        contentEditable.contentEditable = false;
        hideResizeHandles(field);
    });
    currentTextField = null;
    isSelecting = false;
}

// Exit all modes
function exitAllModes() {
    currentTextField = null;
    currentTool = null;
    isSelecting = false;
}

// Enable resize functionality
function enableResize(element) {
    const handles = element.querySelectorAll('.resize-handle');

    handles.forEach(handle => {
        handle.addEventListener('mousedown', (e) => {
            isResizing = true;
            const handleClass = handle.className.split(' ')[1];
            const rect = element.getBoundingClientRect();

            const onMouseMove = (e) => {
                if (isResizing) {
                    if (handleClass.includes('bottom-right')) {
                        element.style.width = `${(e.clientX - rect.left) / scale}px`;
                        element.style.height = `${(e.clientY - rect.top) / scale}px`;
                    } else if (handleClass.includes('bottom-left')) {
                        element.style.width = `${(rect.right - e.clientX) / scale}px`;
                        element.style.height = `${(e.clientY - rect.top) / scale}px`;
                        element.style.left = `${(e.clientX - panX) / scale}px`;
                    } else if (handleClass.includes('top-right')) {
                        element.style.width = `${(e.clientX - rect.left) / scale}px`;
                        element.style.height = `${(rect.bottom - e.clientY) / scale}px`;
                        element.style.top = `${(e.clientY - panY) / scale}px`;
                    } else if (handleClass.includes('top-left')) {
                        element.style.width = `${(rect.right - e.clientX) / scale}px`;
                        element.style.height = `${(rect.bottom - e.clientY) / scale}px`;
                        element.style.left = `${(e.clientX - panX) / scale}px`;
                        element.style.top = `${(e.clientY - panY) / scale}px`;
                    }
                }
            };

            const onMouseUp = () => {
                isResizing = false;
                document.removeEventListener('mousemove', onMouseMove);
                document.removeEventListener('mouseup', onMouseUp);

                if (!element.classList.contains('selected')) {
                    hideResizeHandles(element);
                }
            };

            document.addEventListener('mousemove', onMouseMove);
            document.addEventListener('mouseup', onMouseUp);
        });
    });
}

// Enable drag functionality
function enableDrag(element) {
    let isDragging = false;
    let offsetX, offsetY;

    element.addEventListener('mousedown', (e) => {
        if (isSelecting && !isResizing) {
            isDragging = true;
            offsetX = (e.clientX - element.getBoundingClientRect().left) / scale;
            offsetY = (e.clientY - element.getBoundingClientRect().top) / scale;
        }
    });

    document.addEventListener('mousemove', (e) => {
        if (isDragging) {
            element.style.left = `${(e.clientX - offsetX * scale - panX) / scale}px`;
            element.style.top = `${(e.clientY - offsetY * scale - panY) / scale}px`;
        }
    });

    document.addEventListener('mouseup', () => {
        isDragging = false;
    });
}

// Show resize handles
function showResizeHandles(element) {
    const handles = element.querySelectorAll('.resize-handle');
    handles.forEach(handle => {
        handle.style.display = 'block';
    });
}

// Hide resize handles
function hideResizeHandles(element) {
    const handles = element.querySelectorAll('.resize-handle');
    handles.forEach(handle => {
        handle.style.display = 'none';
    });
}

// Apply text formatting commands
function applyTextFormatting(command) {
    const selection = window.getSelection();
    if (!selection.rangeCount) return;

    const range = selection.getRangeAt(0);
    const span = document.createElement('span');

    switch (command) {
        case 'bold':
            span.style.fontWeight = 'bold';
            break;
        case 'italic':
            span.style.fontStyle = 'italic';
            break;
        case 'underline':
            span.style.textDecoration = 'underline';
            break;
    }

    range.surroundContents(span);
}

// Pan and zoom functionality
canvasContainer.addEventListener('mousedown', (e) => {
    if (e.button === 1) { // Middle mouse button for panning
        isPanning = true;
        panStartX = e.clientX;
        panStartY = e.clientY;
    }
});

document.addEventListener('mousemove', (e) => {
    if (isPanning) {
        panX += e.clientX - panStartX;
        panY += e.clientY - panStartY;
        canvas.style.transform = `translate(${panX}px, ${panY}px) scale(${scale})`;
        panStartX = e.clientX;
        panStartY = e.clientY;
    }
});

document.addEventListener('mouseup', () => {
    isPanning = false;
});

canvasContainer.addEventListener('wheel', (e) => {
    e.preventDefault();
    scale += e.deltaY * -0.001;
    scale = Math.min(Math.max(.125, scale), 4); // Set the min and max scale levels
    canvas.style.transform = `translate(${panX}px, ${panY}px) scale(${scale})`;
});
