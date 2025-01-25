export default (input: string): string => {
  return input
    .toLowerCase() // Convert the entire string to lowercase first
    .split(/([\s-])/) // Split the string by spaces or hyphens, but keep the separators
    .map((word) => {
        // Capitalize the first letter of each word, but skip separators
        if (word.match(/[\s-]/)) {
            return word; // Return the separator as-is
        } else {
            return word.charAt(0).toUpperCase() + word.slice(1); // Capitalize the word
        }
    })
    .join(''); // Join the words and separators back together
}
