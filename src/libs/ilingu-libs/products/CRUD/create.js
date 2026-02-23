import { API } from "aws-amplify";
import * as Sentry from "@sentry/browser";
import config from "../../../../config";

Sentry.init(config.sentry);

/**
 *
 * @param protoProduct
 * @returns {Promise<any>}
 */
export async function createProductAPI(protoProduct) {
  try {
    return await API.post("ilingu", `/products`, {
      body: protoProduct
    })
  } catch (e) {
    Sentry.captureException(e);
    console.log(e);
  }
}