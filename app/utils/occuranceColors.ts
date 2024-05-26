export function generateRandomHexColor() {
    // Generate a random integer between 0 and 16777215 (hexadecimal: FFFFFF)
    const randomColorInt = Math.floor(Math.random() * 16777215);

    // Convert the integer to a hexadecimal string and pad with zeros if necessary
    const hexColorString = randomColorInt.toString(16).padStart(6, '0');

    // Prepend '#' to the hexadecimal color string
    return '#' + hexColorString;
}

export function getColorBrightness(hexColor: string) {
    // Remove the hash symbol if present
    hexColor = hexColor.replace('#', '');

    // Parse the r, g, b values
    const r = parseInt(hexColor.substring(0, 2), 16);
    const g = parseInt(hexColor.substring(2, 4), 16);
    const b = parseInt(hexColor.substring(4, 6), 16);

    // Calculate brightness
    return (r * 299 + g * 587 + b * 114) / 1000;
}

export const BRIGHTNESS_THRESHOLD = 128;