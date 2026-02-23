import { API } from "aws-amplify";
import * as Sentry from "@sentry/browser";
import config from "../../../../config";

Sentry.init(config.sentry);

/**
 *
 * @param courseId
 * @param updateData
 * @returns {Promise<any>}
 */
export async function updateCourseAPI(courseId, updateData) {
  try {
    return await API.put("ilingu", `/courses/${courseId}`, {
      body: updateData
    })
  } catch (e) {
    Sentry.captureException(e);
    console.log(e);
  }
}