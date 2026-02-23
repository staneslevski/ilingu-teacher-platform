import { API } from "aws-amplify";
import * as Sentry from "@sentry/browser";
import config from "../../../../config";

Sentry.init(config.sentry);

/**
 *
 * @param lessonId
 * @param updateData
 * @returns {Promise<any>}
 */
export async function updateLessonAPI(lessonId, updateData) {
  try {
    return await API.put("ilingu", `/lesson/${lessonId}`, {
      body: updateData
    })
  } catch (e) {
    Sentry.captureException(e);
    console.log(e);
  }
}