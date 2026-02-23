import { API } from "aws-amplify";
import * as Sentry from "@sentry/browser";
import config from "../../../../config";

Sentry.init(config.sentry);

/**
 *
 * @param enrolmentId
 * @returns {Promise<any>} a specific student
 */
export async function getEnrolmentAPI(enrolmentId) {
  try {
    return await API.get("ilingu", `/enrolments/${enrolmentId}`, {})
  } catch (e) {
    Sentry.captureException(e);
    console.log(e);
  }
}