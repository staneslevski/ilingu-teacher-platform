// other tests
import { logIn } from "../../../support/TestAsAFunction/Auth/login";
import { signUpForTrialClass } from "../../../support/TestAsAFunction/TrialClass/trialClass";
// data
import studentUserData from "../../../fixtures/student/studentUserData";

context('set routes', () => {
  // cy.route
  logIn(studentUserData);
  signUpForTrialClass();
});
