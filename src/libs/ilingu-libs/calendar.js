import moment from "moment";
import thisIsJustAPlugin from "moment-timezone";


export function dowToNumber(dowFull) {
  let dow;
  switch (dowFull) {
    case "Sunday":
      dow = 0;
      break;
    case "Monday":
      dow = 1;
      break;
    case "Tuesday":
      dow = 2;
      break;
    case "Wednesday":
      dow = 3;
      break;
    case "Thursday":
      dow = 4;
      break;
    case "Friday":
      dow = 5;
      break;
    case "Saturday":
      dow = 6;
      break;
  }
  return dow;
}

export function dowToFull(dowNumber) {
  let dowFull;
  switch (dowNumber) {
    case 0:
      dowFull = "Sunday";
      break;
    case 1:
      dowFull = "Monday";
      break;
    case 2:
      dowFull = "Tuesday";
      break;
    case 3:
      dowFull = "Wednesday";
      break;
    case 4:
      dowFull = "Thursday";
      break;
    case 5:
      dowFull = "Friday";
      break;
    case 6:
      dowFull = "Saturday";
      break;
  }
  return dowFull;
}
