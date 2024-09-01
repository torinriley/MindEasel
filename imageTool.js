export function createImageField(src) {
    const imageField = document.createElement('div');
    imageField.className = 'image-field';
    imageField.style.position = 'absolute';
    imageField.style.top = '50px';
    imageField.style.left = '50px';
    imageField.style.width = '300px';
    imageField.style.height = '300px';
    imageField.style.padding = '0';
    imageField.style.border = 'none';
    imageField.style.background = 'transparent';

    const img = new Image(); // Use Image constructor for better loading control
    img.style.width = '100%';
    img.style.height = '100%';
    img.style.objectFit = 'contain';
    img.draggable = false;

    img.addEventListener('load', () => {
        imageField.appendChild(img);
    });

    img.src = src; // Set the source after event listeners are attached

    // Create caption box
    const captionBox = document.createElement('div');
    captionBox.className = 'caption-box';
    captionBox.style.position = 'absolute';
    captionBox.style.bottom = '0';
    captionBox.style.left = '0';
    captionBox.style.width = '100%';
    captionBox.style.padding = '5px';
    captionBox.style.background = 'rgba(255, 255, 255, 0.5)';
    captionBox.style.color = 'black';
    captionBox.style.borderTop = '1px solid #ccc';
    captionBox.style.boxSizing = 'border-box';
    captionBox.style.display = 'none'; // Hidden by default

    const captionText = document.createElement('div');
    captionText.contentEditable = true;
    captionText.style.fontSize = '14px';
    captionText.style.color = 'black';
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

    // Show caption on double-click
    imageField.addEventListener('dblclick', () => {
        captionBox.style.display = 'block';
        captionText.focus();
    });

    // Hide caption when caption text loses focus
    captionText.addEventListener('blur', () => {
        if (captionText.textContent.trim() === '') {
            captionText.textContent = 'Type caption here...';
            captionBox.style.display = 'none';
        }
    });

    // Add resize handles
    const resizeHandles = ['top-left', 'top-right', 'bottom-left', 'bottom-right'];
    resizeHandles.forEach(handle => {
        const resizeHandle = document.createElement('div');
        resizeHandle.className = `resize-handle ${handle}`;
        imageField.appendChild(resizeHandle);
    });

    enableResize(imageField);
    enableDrag(imageField); // Enable dragging functionality

    document.getElementById('canvas').appendChild(imageField);
    return imageField;
}

function enableResize(element) {
    const handles = element.querySelectorAll('.resize-handle');

    handles.forEach(handle => {
        handle.addEventListener('mousedown', (e) => {
            e.preventDefault();
            const handleClass = handle.className.split(' ')[1];
            const rect = element.getBoundingClientRect();

            const onMouseMove = (e) => {
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
            };

            const onMouseUp = () => {
                document.removeEventListener('mousemove', onMouseMove);
                document.removeEventListener('mouseup', onMouseUp);
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
        e.preventDefault();
        isDragging = true;
        offsetX = e.clientX - element.getBoundingClientRect().left;
        offsetY = e.clientY - element.getBoundingClientRect().top;
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
