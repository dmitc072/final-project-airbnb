export function formatDateToString(date) {
    // Check if the input is already a Date object; if not, try to convert it
    if (!(date instanceof Date)) {
        date = new Date(date); // Convert to Date if it's not already
    }

    // Check if the date is still invalid after conversion
    if (isNaN(date.getTime())) {
        throw new Error("Invalid date format");
    }

    // Get the month, day, and year from the Date object
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const year = date.getFullYear();

    // Format as MM/DD/YYYY
    return `${month}/${day}/${year}`;
}
