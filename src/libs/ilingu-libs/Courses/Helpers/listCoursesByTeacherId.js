import { API } from "aws-amplify";
import * as Sentry from "@sentry/browser";
import config from "../../../../config";

Sentry.init(config.sentry);


/**
 * 
 * @param teacherId
 * @param params
 * @returns {Promise<any>}
 */
export async function listCoursesByTeacherIdAPI(teacherId, params) {
  if (params) {
    Sentry.captureMessage("listLessonsAPI - params supplied, but code is not completed")
  }
  try {
    return await API.get("ilingu", `/teachers/${teacherId}/courses/`, {})
  } catch (e) {
    Sentry.captureException(e);
  }
}