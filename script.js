import { enableResize, enableDrag, selectElement, clearSelection } from './resizeAndDrag.js';
import { createTextField } from './textTool.js';
import { createImageField } from './imageTool.js';
import { deleteSelectedElement, clearCanvas } from './clear.js';

const canvas = document.getElementById('canvas');
const textTool = document.getElementById('text-tool');
const imageUpload = document.getElementById('image-upload');
const clearTool = document.getElementById('clear-tool');

let currentTool = null;

// Initialize tools
textTool.addEventListener('click', () => {
    currentTool = 'text';
    clearSelection(); // Clear any current selection when the text tool is selected
});

imageUpload.addEventListener('change', (e) => {
    if (e.target.files && e.target.files[0]) {
        const reader = new FileReader();
        reader.onload = function(event) {
            const imgElement = createImageField(event.target.result);
            enableResize(imgElement);  // Enable resizing on the image field
            enableDrag(imgElement);    // Enable dragging on the image field
            currentTool = null; // Reset tool after image upload
        };
        reader.readAsDataURL(e.target.files[0]);
    }
});

canvas.addEventListener('click', (e) => {
    const selectedField = e.target.closest('.text-field, .image-field');

    if (selectedField) {
        selectElement(selectedField); // Select the clicked text or image field
        currentTool = null; // Deselect the tool after selecting a field
    } else if (currentTool === 'text') {
        const textElement = createTextField(e.clientX, e.clientY);
        enableResize(textElement);  // Enable resizing on the text field
        enableDrag(textElement);    // Enable dragging on the text field
        currentTool = null; // Reset tool after placing the text field
    } else {
        clearSelection(); // Deselect any selected fields if clicking outside of them
    }
});

document.addEventListener('keydown', (event) => {
    if ((event.key === 'Delete' || event.key === 'Backspace') && !document.activeElement.isContentEditable) {
        deleteSelectedElement(); // Delete the selected element when the delete or backspace key is pressed
    }
});

clearTool.addEventListener('click', () => {
    clearCanvas(); // Clear the entire canvas when the clear button is clicked
});
