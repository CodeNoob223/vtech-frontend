// ✅ format date as MMMM DD, YYYY
const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
export function formatDate(date : Date) {
  return `${monthNames[date.getMonth()]} ${padTo2Digits(date.getDate())}, ${date.getFullYear()}`
}

function padTo2Digits(num : number) {
  return num.toString().padStart(2, '0');
}
//console.log(formatDate(new Date()));
