import { API } from "aws-amplify";
import * as Sentry from "@sentry/browser";
import config from "../../../../config";

Sentry.init(config.sentry);

/**
 *
 * @param params
 * @returns {Promise<any>}
 */
export async function listTeachersAPI(params) {
  if (params) {
    Sentry.captureMessage("listTeachersAPI - params supplied, but code is not completed")
  }
  try {
    let res =  await API.get("ilingu", `/teachers/`, {});
    console.log(res);
    return res
  } catch (e) {
    Sentry.captureException(e);
    console.log(e);
  }
}