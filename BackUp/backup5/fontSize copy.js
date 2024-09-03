const fontSizeMenu = document.getElementById('font-size-menu');
let currentElement = null;

// Function to toggle dropdown menu visibility
export function toggleDropdownMenu(show) {
    if (show) {
        fontSizeMenu.classList.add('dropdown-active');
    } else {
        fontSizeMenu.classList.remove('dropdown-active');
    }
}

export function changeTextSize(size) {
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
                newSize = '16px';
        }
        currentElement.querySelector('.content-editable').style.fontSize = newSize;
    } else {
        alert("Please select a text field to change its font size.");
    }
}

// Function to select the current element and show the font size menu
export function selectTextElement(element) {
    currentElement = element;
    toggleDropdownMenu(true);
}

// Add event listeners to font size buttons
document.getElementById('small-font').addEventListener('click', () => changeTextSize('small'));
document.getElementById('medium-font').addEventListener('click', () => changeTextSize('medium'));
document.getElementById('large-font').addEventListener('click', () => changeTextSize('large'));




