export function isDateWithin30Days(dateString) {
    // Parse the date string (MM/DD/YYYY format)
    const [month, day, year] = dateString.split('/').map(Number);
    const date = new Date(year, month - 1, day); // Month is 0-based in JavaScript
    // Get the current date
    const currentDate = new Date();

    // Calculate the difference in time
    const timeDifference = currentDate - date; // Difference in milliseconds

    // Convert time difference from milliseconds to days
    const daysDifference = timeDifference / (1000 * 60 * 60 * 24);
    console.log("time:",daysDifference <= 30 )
    
    // Check if the difference is less than or equal to 30 days
    return daysDifference <= 30;
}


