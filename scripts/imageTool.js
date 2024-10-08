
//BSP Tree for image rendering
class TreeNode {
    constructor(imageField, left = null, right = null) {
        this.imageField = imageField;
        this.left = left;
        this.right = right;
    }
}

class BSPTree {
    constructor() {
        this.root = null;
    }

    insert(imageField) {
        const x = parseInt(imageField.style.left, 10);
        this.root = this._insertRec(this.root, imageField, x);
    }

    _insertRec(node, imageField, x) {
        if (!node) return new TreeNode(imageField);
        const nodeX = parseInt(node.imageField.style.left, 10);
        if (x < nodeX) {
            node.left = this._insertRec(node.left, imageField, x);
        } else {
            node.right = this._insertRec(node.right, imageField, x);
        }
        return node;
    }

    render(ctx) {
        this._inOrderTraverse(this.root, ctx);
    }

    _inOrderTraverse(node, ctx) {
        if (node) {
            this._inOrderTraverse(node.left, ctx);
            this._renderImage(node.imageField, ctx);
            this._inOrderTraverse(node.right, ctx);
        }
    }

    _renderImage(imageField, ctx) {
        const img = imageField.querySelector('img');
        const x = parseInt(imageField.style.left, 10);
        const y = parseInt(imageField.style.top, 10);
        const width = parseInt(imageField.style.width, 10);
        const height = parseInt(imageField.style.height, 10);
        ctx.drawImage(img, x, y, width, height);
    }
}

const bspTree = new BSPTree();

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
    imageField.style.boxSizing = 'border-box';

    const img = new Image();
    img.style.width = '100%';
    img.style.height = '100%';
    img.style.objectFit = 'contain';
    img.style.maxWidth = '100%';
    img.style.maxHeight = '100%';
    img.draggable = false;

    img.addEventListener('load', () => {
        imageField.appendChild(img);
        document.getElementById('canvas').appendChild(imageField);

        enableResize(imageField);
        enableDrag(imageField);

        // Optional: Insert the image into the BSP tree and render
        const ctx = document.getElementById('canvas').getContext('2d');
        bspTree.insert(imageField);
        bspTree.render(ctx);
    });

    img.src = src;

    const captionBox = document.createElement('div');
    captionBox.className = 'caption-box';
    captionBox.style.position = 'absolute';
    captionBox.style.bottom = '0';
    captionBox.style.left = '0';
    captionBox.style.width = '100%';
    captionBox.style.padding = '5px';
    captionBox.style.background = 'transparent';
    captionBox.style.color = 'black';
    captionBox.style.borderTop = '1px solid #ccc';
    captionBox.style.boxSizing = 'border-box';
    captionBox.style.display = 'none';

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
        }
    });

    const resizeHandles = ['top-left', 'top-right', 'bottom-left', 'bottom-right'];
    resizeHandles.forEach(handle => {
        const resizeHandle = document.createElement('div');
        resizeHandle.className = `resize-handle ${handle}`;
        resizeHandle.style.position = 'absolute';
        resizeHandle.style.width = '10px';
        resizeHandle.style.height = '10px';
        resizeHandle.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
        resizeHandle.style.cursor = `${handle.replace('-', '')}-resize`;

        if (handle.includes('top')) {
            resizeHandle.style.top = '-5px';
        } else {
            resizeHandle.style.bottom = '-5px';
        }

        if (handle.includes('left')) {
            resizeHandle.style.left = '-5px';
        } else {
            resizeHandle.style.right = '-5px';
        }

        imageField.appendChild(resizeHandle);
    });

    imageField.addEventListener('click', () => {
        imageField.classList.add('selected');

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Delete' && imageField.classList.contains('selected')) {
                imageField.remove();
            }
        });
    });

    document.addEventListener('click', (e) => {
        if (!imageField.contains(e.target)) {
            imageField.classList.remove('selected');
        }
    });

    return imageField;
}

export function enableResize(element) {
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

export function enableDrag(element) {
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