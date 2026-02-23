import { API } from "aws-amplify";
import * as Sentry from "@sentry/browser";
import config from "../../../../config";

Sentry.init(config.sentry);

/**
 *
 * @param productId
 * @returns {Promise<any>}
 */
export async function getProductAPI(productId) {
  try {
    return await API.get("ilingu", `/products/${productId}`, {})
  } catch (e) {
    Sentry.captureException(e);
    console.log(e);
  }
}