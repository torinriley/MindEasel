document.getElementById('clear-tool').addEventListener('click', () => {
    const confirmClear = confirm("Are you sure you want to clear the canvas? This action cannot be undone.");
    if (confirmClear) {
        const canvas = document.getElementById('canvas');
        canvas.innerHTML = '';  // Clear all elements from the canvas
    }
});
