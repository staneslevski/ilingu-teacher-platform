import { API } from "aws-amplify";
import * as Sentry from "@sentry/browser";
import config from "../../../../config";

Sentry.init(config.sentry);

/**
 *
 * @param courseId
 * @returns {Promise<any>} a specific student
 */
export async function getCourseAPI(courseId) {
  try {
    return await API.get("ilingu", `/courses/${courseId}`, {})
  } catch (e) {
    Sentry.captureException(e);
    console.log(e);
  }
}