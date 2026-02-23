import { API } from "aws-amplify";
import * as Sentry from "@sentry/browser";
import config from "../../../../config";

Sentry.init(config.sentry);

/**
 *
 * @param userId
 * @param updateData
 * @returns {Promise<any>}
 */
export async function updateTeacherAPI(userId, updateData) {
  try {
    return await API.put("ilingu", `/teachers/${userId}`, {
      body: updateData
    })
  } catch (e) {
    Sentry.captureException(e);
    console.log(e);
  }
}