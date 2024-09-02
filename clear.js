export function deleteSelectedElement() {
    const selectedFields = document.querySelectorAll('.text-field.selected, .image-field.selected');
    selectedFields.forEach(field => {
        field.remove();
    });
}

export function clearCanvas() {
    const userConfirmed = confirm("Are you sure you want to clear the entire canvas? This action cannot be undone.");

    if (userConfirmed) {
        const canvas = document.getElementById('canvas');
        while (canvas.firstChild) {
            canvas.removeChild(canvas.firstChild);
        }
    }
}
