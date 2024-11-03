export function compareDateStringToToday(dateString) {
    // Parse the date string "MM/DD/YYYY" into a Date object
    const [month, day, year] = dateString.split('/').map(Number);
    const parsedDate = new Date(year, month - 1, day); // month is 0-indexed in Date

    // Get today's date
    const today = new Date();
    //console.log("To Date: ",dateString, "Converted to Date: ", parsedDate,"today's Date: ",today )

    // Set the time to midnight for comparison
    today.setHours(0, 0, 0, 0); 

    if (parsedDate > today) { //date is in the future, return true to disable
        return true
    } else if (parsedDate < today){    //date is in the past
        return false 
    }


    //Testing function below
    
    // Compare the dates; will display return as text if I call it like :              
        // <div >{approved.toDate}</div>
        // {compareDateStringToToday(approved.toDate)}
        // <div className={styles.button}></div>
//     if (parsedDate > today) {
//         return 'The date is in the future.';
//     }  else if (parsedDate < today) {
//         return 'The date is in the past.';
//     } else {
//         return 'The date is today.';
//     }
 }

// Example usage:
// const result = compareDateStringToToday("09/23/2024");
// console.log(result);
