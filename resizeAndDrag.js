export function enableResize(element) {
    const handles = element.querySelectorAll('.resize-handle');

    handles.forEach(handle => {
        handle.addEventListener('mousedown', (e) => {
            let isResizing = true;
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

export function enableDrag(element) {
    let isDragging = false;
    let offsetX, offsetY;

    element.addEventListener('mousedown', (e) => {
        if (!e.target.classList.contains('resize-handle')) {
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

export function selectElement(element) {
    clearSelection();
    element.classList.add('selected');
    showResizeHandles(element);
}

export function clearSelection() {
    const selectedFields = document.querySelectorAll('.text-field.selected, .image-field.selected');
    selectedFields.forEach(field => {
        field.classList.remove('selected');
        hideResizeHandles(field);
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
