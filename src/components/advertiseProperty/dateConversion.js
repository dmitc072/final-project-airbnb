export  function dateConversion (dateString) {
    const [month, day, year] = dateString.split('/').map(Number);
    const date = new Date(year, month - 1, day); // Month is 0-based in JavaScript
    return date

    
}