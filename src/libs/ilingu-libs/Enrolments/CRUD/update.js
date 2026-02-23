import { API } from "aws-amplify";
import * as Sentry from "@sentry/browser";
import config from "../../../../config";

Sentry.init(config.sentry);

/**
 *
 * @param enrolmentId
 * @param updateData
 * @returns {Promise<any>}
 */
export async function updateEnrolmentAPI(enrolmentId, updateData) {
  try {
    return await API.put("ilingu", `/enrolments/${enrolmentId}`, {
      body: updateData
    })
  } catch (e) {
    Sentry.captureException(e);
    console.log(e);
  }
}