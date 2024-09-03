import { toggleDropdownMenu, selectTextElement } from './fontSize.js';


const canvas = document.getElementById('canvas');
const textTool = document.getElementById('text-tool');
const imageUpload = document.getElementById('image-upload');
const clearTool = document.getElementById('clear-tool');

let currentTool = null;
let isResizing = false;
let isSelecting = true;
let currentElement = null;
let copiedElement = null;
let textElements = {}; // Object to store text content keyed by element ID

// Format menu elements
const formatMenu = document.getElementById('format-menu');
const boldButton = document.getElementById('bold-button');
const italicButton = document.getElementById('italic-button');
const underlineButton = document.getElementById('underline-button');
const fontSizeSelect = document.getElementById('font-size');

// Create a container for the font size buttons
const fontSizeButtons = document.createElement('div');
fontSizeButtons.id = 'font-size-buttons';

fontSizeButtons.innerHTML = `
    <button id="small-font">Small</button>
    <button id="medium-font">Medium</button>
    <button id="large-font">Large</button>
`;

// Append the font size buttons to the body, so they can be positioned anywhere
document.body.appendChild(fontSizeButtons);

// Attach event listeners to the font size buttons
document.getElementById('small-font').addEventListener('click', () => changeTextSize('small'));
document.getElementById('medium-font').addEventListener('click', () => changeTextSize('medium'));
document.getElementById('large-font').addEventListener('click', () => changeTextSize('large'));

textTool.addEventListener('click', () => {
    currentTool = 'text';
    isSelecting = false;
    clearSelection();
});

imageUpload.addEventListener('change', (e) => {
    if (e.target.files && e.target.files[0]) {
        const reader = new FileReader();
        reader.onload = function(event) {
            createImageField(event.target.result);
        };
        reader.readAsDataURL(e.target.files[0]);
    }
});

// Add click event listener for selecting text fields
canvas.addEventListener('click', (e) => {
    const selectedField = e.target.closest('.text-field');
    if (selectedField) {
        selectTextElement(selectedField);
    } else {
        toggleDropdownMenu(false);
    }
});

document.addEventListener('keydown', (event) => {
    if ((event.key === 'Delete' || event.key === 'Backspace') && !document.activeElement.isContentEditable) {
        const selectedFields = document.querySelectorAll('.text-field.selected, .image-field.selected');
        selectedFields.forEach(field => {
            field.remove();
        });
        fontSizeButtons.style.display = 'none'; // Hide the font size menu
    }

    if (event.ctrlKey && event.key === 'c' && currentElement && !isSelecting) {
        copyElement(currentElement);
    }

    if (event.ctrlKey && event.key === 'v' && copiedElement) {
        pasteElement();
    }
});

canvas.addEventListener('click', (e) => {
    if (currentTool === 'text' && !isSelecting && !currentElement) {
        createTextField(e.clientX, e.clientY);
    } else if (isSelecting) {
        const selectedField = e.target.closest('.text-field, .image-field');
        if (selectedField) {
            selectElement(selectedField);
        } else {
            clearSelection();
            fontSizeButtons.style.display = 'none'; // Hide the font size menu
        }
    }

    // Hide the format menu if the click is outside of the selected text
    if (!window.getSelection().toString()) {
        formatMenu.style.display = 'none';
    }
});

function changeTextSize(size) {
    if (currentElement && currentElement.classList.contains('text-field')) {
        let newSize;
        switch(size) {
            case 'small':
                newSize = '16px';
                break;
            case 'medium':
                newSize = '24px';
                break;
            case 'large':
                newSize = '32px';
                break;
            default:
                newSize = '16px'; // Default case for safety
        }
        const contentEditable = currentElement.querySelector('.content-editable');
        contentEditable.style.fontSize = newSize;
        saveTextContent(currentElement.id, contentEditable.textContent); // Save the updated text content
    } else {
        alert("Please select a text field to change its font size.");
    }
}

function saveTextContent(elementId, text) {
    textElements[elementId] = text;
}

function createTextField(x, y) {
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
        if (!isResizing) enterSelectMode();
        saveTextContent(textField.id, contentEditable.textContent); // Save the text content on blur
    });

    contentEditable.addEventListener('mouseup', () => {
        showFormatMenu();
    });

    textField.appendChild(contentEditable);

    const resizeHandles = ['top-left', 'top-right', 'bottom-left', 'bottom-right'];
    resizeHandles.forEach(handle => {
        const resizeHandle = document.createElement('div');
        resizeHandle.className = `resize-handle ${handle}`;
        textField.appendChild(resizeHandle);
    });

    canvas.appendChild(textField);
    currentElement = textField;

    enableResize(textField);
    enableDrag(textField);

    selectElement(textField);
    contentEditable.focus();
}

function selectElement(element) {
    clearSelection();
    element.classList.add('selected');
    currentElement = element;
    showResizeHandles(element);

    const contentEditable = element.querySelector('.content-editable');
    if (contentEditable) {
        if (isSelecting) {
            contentEditable.classList.add('disabled');
            contentEditable.contentEditable = false;
        } else {
            contentEditable.classList.remove('disabled');
            contentEditable.contentEditable = true;
        }

        element.addEventListener('dblclick', () => {
            isSelecting = false;
            contentEditable.classList.remove('disabled');
            contentEditable.contentEditable = true;
            contentEditable.focus();
        });

        contentEditable.addEventListener('click', (e) => {
            e.stopPropagation();
        });

        // Show font size buttons and position them above the selected text field
        positionFontSizeButtons(element);
        fontSizeButtons.style.display = 'block';
    }
}

function clearSelection() {
    const selectedFields = document.querySelectorAll('.text-field.selected, .image-field.selected');
    selectedFields.forEach(field => {
        field.classList.remove('selected');
        hideResizeHandles(field);

        const contentEditable = field.querySelector('.content-editable');
        if (contentEditable) {
            contentEditable.classList.add('disabled');
            contentEditable.contentEditable = false;
        }
    });
    currentElement = null;

    fontSizeButtons.style.display = 'none';
}

function positionFontSizeButtons(element) {
    const rect = element.getBoundingClientRect();
    const menuHeight = fontSizeButtons.offsetHeight;
    const menuWidth = fontSizeButtons.offsetWidth;

    // Define a fixed offset to ensure the menu is well above the text box
    const fixedOffset = 40; // This ensures the menu is always 20px above the text box

    // Set the ideal position above the text box with a fixed offset
    let top = rect.top - menuHeight - fixedOffset;
    let left = rect.left;

    // Check if there's enough space above the text box
    if (top < 0) {
        // Not enough space above, position below the text box instead
        top = rect.bottom + fixedOffset; // Position below with the fixed offset
    }

    // Ensure the menu stays within the viewport horizontally
    if (left + menuWidth > window.innerWidth) {
        left = window.innerWidth - menuWidth - 10; // 10px padding from the right edge
    }

    // Ensure the menu stays within the viewport vertically (for below position)
    if (top + menuHeight > window.innerHeight) {
        top = window.innerHeight - menuHeight - 10; // 10px padding from the bottom edge
    }

    // Apply the calculated position with a high z-index to ensure it's on top
    fontSizeButtons.style.top = `${top}px`;
    fontSizeButtons.style.left = `${left}px`;
    fontSizeButtons.style.zIndex = '9999'; // Ensure the menu is always on top
}



function showFormatMenu() {
    const selection = window.getSelection();
    if (selection.rangeCount > 0 && !selection.isCollapsed) {
        const range = selection.getRangeAt(0);
        const rect = range.getBoundingClientRect();
        formatMenu.style.top = `${rect.top - formatMenu.offsetHeight - 10}px`;
        formatMenu.style.left = `${rect.left}px`;
        formatMenu.style.display = 'flex';
    } else {
        formatMenu.style.display = 'none';
    }
}

boldButton.addEventListener('click', () => {
    if (currentElement) {
        const contentEditable = currentElement.querySelector('.content-editable');
        contentEditable.focus();
        document.execCommand('bold', false, null);
        showFormatMenu();
    }
});

italicButton.addEventListener('click', () => {
    if (currentElement) {
        const contentEditable = currentElement.querySelector('.content-editable');
        contentEditable.focus();
        document.execCommand('italic', false, null);
        showFormatMenu();
    }
});

underlineButton.addEventListener('click', () => {
    if (currentElement) {
        const contentEditable = currentElement.querySelector('.content-editable');
        contentEditable.focus();
        document.execCommand('underline', false, null);
        showFormatMenu();
    }
});

fontSizeSelect.addEventListener('change', () => {
    if (currentElement) {
        const contentEditable = currentElement.querySelector('.content-editable');
        contentEditable.focus();
        document.execCommand('fontSize', false, '7');  // Use size 7 as a placeholder
        const fontElements = document.querySelectorAll('font[size="7"]');
        fontElements.forEach(font => {
            font.removeAttribute('size');
            font.style.fontSize = fontSizeSelect.value;
        });
        showFormatMenu();
    }
});

function createImageField(src) {
    const imageField = document.createElement('div');
    imageField.className = 'image-field';
    imageField.style.top = '50px';
    imageField.style.left = '50px';
    imageField.style.width = '300px';  
    imageField.style.height = '300px';
    imageField.style.padding = '0';    
    imageField.style.border = 'none';
    imageField.style.background = 'transparent';
    imageField.style.position = 'relative';

    const img = document.createElement('img');
    img.src = src;
    img.style.width = '100%';
    img.style.height = '100%';
    img.style.objectFit = 'contain';
    img.draggable = false;

    imageField.appendChild(img);

    const captionBox = document.createElement('div');
    captionBox.style.position = 'absolute';
    captionBox.style.bottom = '0';
    captionBox.style.left = '0';
    captionBox.style.width = '100%';
    captionBox.style.padding = '5px';
    captionBox.style.background = 'transparent';
    captionBox.style.borderTop = '1px solid #ccc';
    captionBox.style.boxSizing = 'border-box';
    captionBox.style.display = 'none';
    captionBox.style.zIndex = '1';

    const captionText = document.createElement('div');
    captionText.contentEditable = true;
    captionText.style.fontSize = '14px';
    captionText.style.color = 'grey';
    captionText.style.outline = 'none';
    captionText.textContent = 'Type caption here...';

    captionText.addEventListener('focus', function handleFocus() {
        if (captionText.textContent === 'Type caption here...') {
            captionText.textContent = '';
            captionText.removeEventListener('focus', handleFocus);
        }
    });

    captionBox.appendChild(captionText);
    imageField.appendChild(captionBox);

    imageField.addEventListener('dblclick', () => {
        captionBox.style.display = 'block';
        captionText.focus();
    });

    captionText.addEventListener('blur', () => {
        if (captionText.textContent.trim() === '') {
            captionText.textContent = 'Type caption here...';
            captionBox.style.display = 'none';
        } else {
            captionBox.style.display = 'block';
        }
    });

    const resizeHandles = ['top-left', 'top-right', 'bottom-left', 'bottom-right'];
    resizeHandles.forEach(handle => {
        const resizeHandle = document.createElement('div');
        resizeHandle.className = `resize-handle ${handle}`;
        imageField.appendChild(resizeHandle);
    });

    canvas.appendChild(imageField);
    currentElement = imageField;

    enableResize(imageField);
    enableDrag(imageField);

    selectElement(imageField);
}

function copyElement(element) {
    copiedElement = element.cloneNode(true);
    copiedElement.style.top = `${parseInt(element.style.top) + 20}px`;
    copiedElement.style.left = `${parseInt(element.style.left) + 20}px`;
}

function pasteElement() {
    if (copiedElement) {
        const pastedElement = copiedElement.cloneNode(true);
        canvas.appendChild(pastedElement);
        enableResize(pastedElement);
        enableDrag(pastedElement);
        selectElement(pastedElement);
        copiedElement = pastedElement;
    }
}

function enterSelectMode() {
    isSelecting = true;
    currentTool = null;
    clearSelection();
}

function enableResize(element) {
    const handles = element.querySelectorAll('.resize-handle');

    handles.forEach(handle => {
        handle.addEventListener('mousedown', (e) => {
            isResizing = true;
            const handleClass = handle.className.split(' ')[1];
            const rect = element.getBoundingClientRect();

            showResizeHandles(element);

            const onMouseMove = (e) => {
                if (isResizing) {
                    if (handleClass.includes('bottom-right')) {
                        element.style.width = `${e.clientX - rect.left}px`;
                        element.style.height = `${e.clientY - rect.top}px`;
                    } else if (handleClass.includes('bottom-left')) {
                        element.style.width = `${rect.right - e.clientX}px`;
                        element.style.height = `${e.clientY - rect.top}px`;
                        element.style.left = `${e.clientX}px`;
                    } else if (handleClass.includes('top-right')) {
                        element.style.width = `${e.clientX - rect.left}px`;
                        element.style.height = `${rect.bottom - e.clientY}px`;
                        element.style.top = `${e.clientY}px`;
                    } else if (handleClass.includes('top-left')) {
                        element.style.width = `${rect.right - e.clientX}px`;
                        element.style.height = `${rect.bottom - e.clientY}px`;
                        element.style.left = `${e.clientX}px`;
                        element.style.top = `${e.clientY}px`;
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

function enableDrag(element) {
    let isDragging = false;
    let offsetX, offsetY;

    element.addEventListener('mousedown', (e) => {
        if (isSelecting && !isResizing) {
            isDragging = true;
            offsetX = e.clientX - element.getBoundingClientRect().left;
            offsetY = e.clientY - element.getBoundingClientRect().top;
        }
    });

    document.addEventListener('mousemove', (e) => {
        if (isDragging) {
            element.style.left = `${e.clientX - offsetX}px`;
            element.style.top = `${e.clientY - offsetY}px`;
        }
    });

    document.addEventListener('mouseup', () => {
        isDragging = false;
    });
}

function showResizeHandles(element) {
    const handles = element.querySelectorAll('.resize-handle');
    handles.forEach(handle => {
        handle.style.display = 'block';
    });
}

function hideResizeHandles(element) {
    const handles = element.querySelectorAll('.resize-handle');
    handles.forEach(handle => {
        handle.style.display = 'none';
    });
}
