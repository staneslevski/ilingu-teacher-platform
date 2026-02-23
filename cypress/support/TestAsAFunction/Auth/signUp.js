export const signUpAsUser = (userData) => {
  context('Assertions', () => {
    before(() => {
      cy.clearCookies();
      cy.visit('http://ilingu.test:3001');
    });

    describe('Implicit Assertions', () => {
      it('.should() - make an assertion about the current subject', () => {
        cy.get('#user_register_button').should('have.text', 'Register')
          .should('be.visible')
          .click();
        cy.get('#studentName')
          .click()
          .type(userData.studentName);
        cy.get('#chineseName')
          .click()
          .type(userData.chineseName);
        cy.get('#regEmail')
          .click()
          .type(userData.email);
        cy.get('#password')
          .click()
          .type(userData.password);
        cy.get('#confirmPassword')
          .click()
          .type(userData.password);
        cy.get("#TAndCRadio")
          .click();
        cy.get('#login_submit_button')
          .click();
      })
    });
  });
};
