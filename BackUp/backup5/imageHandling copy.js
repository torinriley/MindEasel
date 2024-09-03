export function createImageField(src) {
    const canvas = document.getElementById('canvas');
    
    const imageField = document.createElement('div');
    imageField.className = 'image-field';
    imageField.style.position = 'absolute';
    imageField.style.top = '50px';  // Initial position
    imageField.style.left = '50px';
    imageField.style.width = '300px';  
    imageField.style.height = '300px';
    imageField.style.padding = '0';    
    imageField.style.border = 'none';
    imageField.style.background = 'transparent';

    const img = document.createElement('img');
    img.src = src;
    img.style.width = '100%';
    img.style.height = '100%';
    img.style.objectFit = 'contain';
    img.draggable = false;

    img.onload = function() {
        // Position or resize the image based on its natural size or container
        adjustImagePosition(imageField);
    };

    imageField.appendChild(img);

    // Append the imageField to the canvas once the image is ready
    canvas.appendChild(imageField);

    enableResize(imageField);
    enableDrag(imageField);

    selectElement(imageField);
}

function adjustImagePosition(imageField) {
    const previousImages = document.querySelectorAll('.image-field');
    if (previousImages.length > 1) {
        const lastImage = previousImages[previousImages.length - 2];
        const lastRect = lastImage.getBoundingClientRect();
        imageField.style.top = `${lastRect.bottom + 10}px`; // Position below the last image
        imageField.style.left = `${lastRect.left}px`; // Align with the last image
    }
}

function enableResize(element) {
    const handles = element.querySelectorAll('.resize-handle');

    handles.forEach(handle => {
        handle.addEventListener('mousedown', (e) => {
            let isResizing = true;
            const handleClass = handle.className.split(' ')[1];
            const rect = element.getBoundingClientRect();

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
        if (!isResizing) {
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

function selectElement(element) {
    clearSelection();
    element.classList.add('selected');
}

function clearSelection() {
    const selectedFields = document.querySelectorAll('.text-field.selected, .image-field.selected');
    selectedFields.forEach(field => {
        field.classList.remove('selected');
    });
}
