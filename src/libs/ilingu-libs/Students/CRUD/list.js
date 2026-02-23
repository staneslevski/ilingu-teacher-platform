import { API } from "aws-amplify";
import * as Sentry from "@sentry/browser";
import config from "../../../../config";

Sentry.init(config.sentry);

/**
 *
 * @param params
 * @returns {Promise<any>}
 */
export async function listStudentsAPI(params) {
  if (params) {
    Sentry.captureMessage("listStudentsAPI - params supplied, but code is not completed")
  }
  try {
    return await API.get("ilingu", `/students/`, {})
  } catch (e) {
    Sentry.captureException(e);
    console.log(e);
  }
}