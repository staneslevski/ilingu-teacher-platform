import { API } from "aws-amplify";
import * as Sentry from "@sentry/browser";
import config from "../../../../config";

Sentry.init(config.sentry);

/**
 *
 * @param params
 * @returns {Promise<any>}
 */
export async function listCoursesAPI(params) {
  if (params) {
    Sentry.captureMessage("listCoursesAPI - params supplied, but code is not completed")
  }
  try {
    return await API.get("ilingu", `/courses/`, {})
  } catch (e) {
    Sentry.captureException(e);
    console.log(e);
  }
}