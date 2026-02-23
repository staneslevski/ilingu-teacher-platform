import { API } from "aws-amplify";
import * as Sentry from "@sentry/browser";
import config from "../../../../config";

Sentry.init(config.sentry);

// get
export async function getTeacherAPI(teacherId) {
  try {
    return await API.get("ilingu", `/teachers/${teacherId}`, {})
  } catch (e) {
    Sentry.captureException(e);
    console.log(e);
  }
}