export function formatDateToString(date) {
    // Get the month, day, and year from the Date object
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Months are 0-based, so add 1
    const day = date.getDate().toString().padStart(2, '0'); // Ensure day has two digits
    const year = date.getFullYear();

    // Format as MM/DD/YYYY
    return `${month}/${day}/${year}`;
}