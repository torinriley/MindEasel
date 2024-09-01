export function toggleDropdownMenu(visible) {
    const fontSizeButtons = document.getElementById('font-size-buttons');
    fontSizeButtons.style.display = visible ? 'block' : 'none';
}

export function changeTextSize(size) {
    const currentElement = document.querySelector('.text-field.selected');
    if (currentElement) {
        const contentEditable = currentElement.querySelector('.content-editable');
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
        contentEditable.style.fontSize = newSize;
    } else {
        alert("Please select a text field to change its font size.");
    }
}

export function positionFontSizeButtons(element) {
    const fontSizeButtons = document.getElementById('font-size-buttons');
    const rect = element.getBoundingClientRect();
    const menuHeight = fontSizeButtons.offsetHeight;
    const menuWidth = fontSizeButtons.offsetWidth;

    const fixedOffset = 40;
    let top = rect.top - menuHeight - fixedOffset;
    let left = rect.left;

    if (top < 0) {
        top = rect.bottom + fixedOffset;
    }

    if (left + menuWidth > window.innerWidth) {
        left = window.innerWidth - menuWidth - 10;
    }

    if (top + menuHeight > window.innerHeight) {
        top = window.innerHeight - menuHeight - 10;
    }

    fontSizeButtons.style.top = `${top}px`;
    fontSizeButtons.style.left = `${left}px`;
    fontSizeButtons.style.zIndex = '9999';
}
