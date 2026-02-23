import { API } from "aws-amplify";
import * as Sentry from "@sentry/browser";
import config from "../../../../config";

Sentry.init(config.sentry);

/**
 *
 * @param studentId
 * @returns {Promise<any>} a specific student
 */
export async function getStudentAPI(studentId) {
  try {
    return await API.get("ilingu", `/students/${studentId}`, {})
  } catch (e) {
    Sentry.captureException(e);
    console.log(e);
  }
}