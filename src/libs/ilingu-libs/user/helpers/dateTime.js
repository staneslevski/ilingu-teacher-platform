import moment from "moment";


/**
 * This function takes a moment object which is incorrectly zoned to UTC
 * The time is ACTUALLY in the user's local time. It must therefore be converted
 * from userTimeZone to UTC
 *
 * IF YOU PUT IN AN AMBIGUOUSLY ZONED OBJECT EVERYTHING WILL GO TO SHIT!!!
 *
 * 1. Take moment object and convert to string
 * 2. cut the 'z' off the end
 * 3. create a new moment object from the ambiguously zoned dateTime string and
 *    impose the correct timezone on it. eg. moment.tz(ambigString, userTimeZone)
 *
 * 4. convert to correct UTC moment object by calling
 *    moment.utc(resultOfLast)
 *
 *
 * @param momentObject
 *
 * @param userTimeZone
 * @return moment.Moment object which is correct UTC time
 *          must be used in conjunction with correct timezone parsing for the user
 */
export function userTzToUtc(momentObject, userTimeZone) {
  let dateTimeString = moment.utc(momentObject).format();
  dateTimeString = dateTimeString.slice(0, -1);
  let realDateTime = moment.tz(dateTimeString, userTimeZone);
  return moment.utc(realDateTime)
}