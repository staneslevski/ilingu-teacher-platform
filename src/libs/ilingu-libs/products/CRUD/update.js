import { API } from "aws-amplify";
import * as Sentry from "@sentry/browser";
import config from "../../../../config";

Sentry.init(config.sentry);

/**
 *
 * @param productId
 * @param updateData
 * @returns {Promise<any>}
 */
export async function updateProductAPI(productId, updateData) {
  try {
    return await API.put("ilingu", `/students/${productId}`, {
      body: updateData
    })
  } catch (e) {
    Sentry.captureException(e);
    console.log(e);
  }
}