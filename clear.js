export function deleteSelectedElement() {
    const selectedFields = document.querySelectorAll('.text-field.selected, .image-field.selected');
    selectedFields.forEach(field => {
        field.remove();
    });
}

export function clearCanvas() {
    const canvas = document.getElementById('canvas');
    while (canvas.firstChild) {
        canvas.removeChild(canvas.firstChild);
    }
}
