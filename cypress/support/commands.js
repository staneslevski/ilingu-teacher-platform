// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//

// -- This is a parent command --
Cypress.Commands.add("loginAsStudent", () => {
  let user = Cypress.env('testStudent');
  cy.clearCookies();
  cy.get('#login_button')
    .click();
  cy.get('#emailAsName')
    .click()
    .type(user.username);
  cy.get('#password')
    .click()
    .type(user.password);
  cy.get('#login_submit_button')
    .click();
});
Cypress.Commands.add("login", (user) => {
  cy.clearCookies();
  cy.get('#login_button')
    .click();
  cy.get('#emailAsName')
    .click()
    .type(user.username);
  cy.get('#password')
    .click()
    .type(user.password);
  cy.get('#login_submit_button')
    .click();
});
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This is will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })
