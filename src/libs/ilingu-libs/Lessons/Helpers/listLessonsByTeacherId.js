import { API } from "aws-amplify";
import * as Sentry from "@sentry/browser";
import config from "../../../../config";

Sentry.init(config.sentry);



export async function listLessonsByTeacherIdAPI(teacherId, params) {
  if (params) {
    Sentry.captureMessage("listLessonsAPI - params supplied, but code is not completed", params)
  }
  try {
    return await API.get("ilingu", `/teachers/${teacherId}/lessons/`, {})
  } catch (e) {
    Sentry.captureException(e);
  }
}