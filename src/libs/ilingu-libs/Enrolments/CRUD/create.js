import { API } from "aws-amplify";
import * as Sentry from "@sentry/browser";
import config from "../../../../config";

Sentry.init(config.sentry);

function EnrolmentException(message, enrolment) {
  this.message = message;
  this.enrolment = enrolment;
  this.name = "Enrolment Exception"
}

export async function createEnrolmentAPI(enrolment, currency) {
  if (!enrolment.courseId) {
    throw new EnrolmentException("Create enrolment failed. No course ID", enrolment)
  } else if (!enrolment.productId) {
    throw new EnrolmentException("Create enrolment failed. No product ID", enrolment)
  } else if (!enrolment.studentId) {
    throw new EnrolmentException("Create enrolment failed. No Student ID", enrolment)
  } else if (!enrolment.purchasedLessons) {
    throw new EnrolmentException("Create enrolment failed. No purchased lessons (quantity)", enrolment)
  } else if (!enrolment.paymentMethod) {
    // must be ("stripe" || "trial" || "gift")
    throw new EnrolmentException("Create enrolment failed. No payment method", enrolment)
  } else {
    try {
      // set required attributes
      let body = {
        courseId: enrolment.courseId,
        productId: enrolment.productId,
        studentId: enrolment.studentId,
        purchasedLessons: enrolment.purchasedLessons,
        paymentMethod: enrolment.paymentMethod,
      };
      // set optional attributes
      if (enrolment.discount) {
        body.discount = enrolment.discount
      }
      if (enrolment.expiryDate) {
        body.expiryDate = enrolment.expiryDate
      }
      return await API.post("ilingu", "/enrolments", {
        queryStringParameters: {
          currency: currency
        },
        body: body
      });
    } catch (e) {
      Sentry.captureException(e);
      console.log(e);
    }
  }
}