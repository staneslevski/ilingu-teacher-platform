import studentUserData from "../../../../fixtures/student/studentUserData";

import { logIn } from "../../../TestAsAFunction/Auth/login";

logIn(studentUserData);

// test lessons page
context('set up', () => {
  before(() => {
    cy.visit('http://ilingu.test:3001');
  });
  describe('navigate to home page', () => {
    it('is available in the navbar', () => {
      cy.get('#uni_dropdown')
        .should('have.text', "Study in China")
        .click();
      cy.get('#bfsu_link')
        .should('have.text', "Business School")
    })
  })
});