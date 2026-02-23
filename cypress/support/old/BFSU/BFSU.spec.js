// BFSU is not an authenticated route, therefore it is not necessary to login

export const BFSU = () => {
  context('set up', () => {
    before(() => {
      cy.visit('http://ilingu.test:3001');
    });
    describe('BFSU tests for navigating to the BFSU page and checking it', () => {
      it('is available in the navbar', () => {
        cy.get('#uni_dropdown')
          .should('have.text', "Study in China")
          .click();
        cy.get('#bfsu_link')
          .should('have.text', "Business School")
          .click();
      })
    })
  })
};

BFSU();