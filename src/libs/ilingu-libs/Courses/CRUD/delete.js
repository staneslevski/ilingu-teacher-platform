import { API } from "aws-amplify";
import * as Sentry from "@sentry/browser";
import config from "../../../../config";

Sentry.init(config.sentry);

/**
 *
 * @param courseId
 * @returns {Promise<any>} a specific student
 */
export async function deleteCourseAPI(courseId) {
  try {
    return await API.del("ilingu", `/courses/${courseId}`, {})
  } catch (e) {
    Sentry.withScope(scope => {
      scope.setTag("file", "src/libs/ilingu-libs/Courses/CRUD/delete.js")
      Sentry.captureException(e);
    });
    console.log(e);
  }
}