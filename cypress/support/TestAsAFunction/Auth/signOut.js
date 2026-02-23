export const signOut = () => {
  context('Assertions', () => {
    describe('get login button and fill in form', () => {
      it('nav is in logged in state', () => {
        cy.get('#my_ilingu_dropdown', {timeout: 20000})
          .should('exist')
          .click();
      });
      it('sign out flow is possible', () => {
        cy.get('#sign_out_span')
          .should('exist')
          .click();
        cy.get('#sign_out_confirm_button')
          .click()
      });
      it('should be logged out', () => {
        cy.get('#login_button')
          .should('exist')
          .should('have.text', 'Login')
          .should('be.visible')
      });
    });
  });
};