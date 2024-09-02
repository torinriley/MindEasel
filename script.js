import { enableResize, enableDrag, selectElement, clearSelection } from './scripts/resizeAndDrag.js';
import { createTextField } from './scripts/textTool.js';
import { createImageField } from './scripts/imageTool.js';
import { deleteSelectedElement, clearCanvas } from './scripts/clear.js';

const canvas = document.getElementById('canvas');
const textTool = document.getElementById('text-tool');
const imageUpload = document.getElementById('image-upload');
const clearTool = document.getElementById('clear-tool');

const fontTitleButton = document.getElementById('font-title');
const fontSmallButton = document.getElementById('font-small');
const fontMediumButton = document.getElementById('font-medium');
const fontLargeButton = document.getElementById('font-large');

const fontArialButton = document.getElementById('font-arial');
const fontTimesButton = document.getElementById('font-times');
const fontCourierButton = document.getElementById('font-courier');

let currentTool = null;

textTool.addEventListener('click', () => {
    currentTool = 'text';
    clearSelection();
    hideFontButtons();
});

imageUpload.addEventListener('change', (e) => {
    if (e.target.files && e.target.files[0]) {
        const reader = new FileReader();
        reader.onload = function(event) {
            const imgElement = createImageField(event.target.result);
            enableResize(imgElement);
            enableDrag(imgElement);
            currentTool = null;
            hideFontButtons();
        };
        reader.readAsDataURL(e.target.files[0]);
    }
});

canvas.addEventListener('click', (e) => {
    const selectedField = e.target.closest('.text-field, .image-field');

    if (selectedField) {
        selectElement(selectedField);
        currentTool = null;
        if (selectedField.classList.contains('text-field')) {
            showFontButtons();
        } else {
            hideFontButtons();
        }
    } else if (currentTool === 'text') {
        const textElement = createTextField(e.clientX, e.clientY);
        enableResize(textElement);
        enableDrag(textElement);
        currentTool = null;
        showFontButtons();
    } else {
        clearSelection();
        hideFontButtons();
    }
});

document.addEventListener('keydown', (event) => {
    if ((event.key === 'Delete' || event.key === 'Backspace') && !document.activeElement.isContentEditable) {
        deleteSelectedElement();
        hideFontButtons();
    }
});

clearTool.addEventListener('click', () => {
    clearCanvas();
    hideFontButtons();
});

fontTitleButton.addEventListener('click', () => changeFontSize('24px'));
fontSmallButton.addEventListener('click', () => changeFontSize('12px'));
fontMediumButton.addEventListener('click', () => changeFontSize('16px'));
fontLargeButton.addEventListener('click', () => changeFontSize('20px'));

fontArialButton.addEventListener('click', () => changeFontType('Arial, sans-serif'));
fontTimesButton.addEventListener('click', () => changeFontType('"Times New Roman", serif'));
fontCourierButton.addEventListener('click', () => changeFontType('"Courier New", monospace'));


fontTitleButton.addEventListener('click', () => {
    changeFontSize('24px');
    const selectedField = document.querySelector('.text-field.selected .content-editable');
    if (selectedField) {
        selectedField.style.fontWeight = 'bold';
        selectedField.style.textAlign = 'center';
    }
});

function changeFontSize(size) {
    const selectedField = document.querySelector('.text-field.selected .content-editable');
    if (selectedField) {
        selectedField.style.fontSize = size;
        selectedField.style.textAlign = 'left';
        selectedField.style.fontWeight = 'normal';
    }
}

function changeFontType(font) {
    const selectedField = document.querySelector('.text-field.selected .content-editable');
    if (selectedField) {
        selectedField.style.fontFamily = font;
    }
}

function showFontButtons() {
    const fontSizeButtons = document.getElementById('font-size-buttons');
    const fontTypeButtons = document.getElementById('font-type-buttons');
    fontSizeButtons.classList.add('show-buttons');
    fontTypeButtons.classList.add('show-buttons');
}

function hideFontButtons() {
    const fontSizeButtons = document.getElementById('font-size-buttons');
    const fontTypeButtons = document.getElementById('font-type-buttons');
    fontSizeButtons.classList.remove('show-buttons');
    fontTypeButtons.classList.remove('show-buttons');
}
