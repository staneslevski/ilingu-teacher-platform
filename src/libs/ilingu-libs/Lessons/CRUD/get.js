import { API } from "aws-amplify";
import * as Sentry from "@sentry/browser";
import config from "../../../../config";

Sentry.init(config.sentry);

/**
 *
 * @param lessonId
 * @returns {Promise<any>} a specific student
 */
export async function getLessonAPI(lessonId) {
  try {
    return await API.get("ilingu", `/lessons/${lessonId}`, {})
  } catch (e) {
    Sentry.captureException(e);
    console.log(e);
  }
}