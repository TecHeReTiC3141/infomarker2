export function generateRandomHexColor() {
    // Generate a random integer between 0 and 16777215 (hexadecimal: FFFFFF)
    const randomColorInt = Math.floor(Math.random() * 16777215);

    // Convert the integer to a hexadecimal string and pad with zeros if necessary
    const hexColorString = randomColorInt.toString(16).padStart(6, '0');

    // Prepend '#' to the hexadecimal color string
    return '#' + hexColorString;
}