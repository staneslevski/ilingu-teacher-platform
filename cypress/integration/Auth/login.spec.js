import adminData from "../../fixtures/admins/adminUserData";

context('Assertions', () => {
  before(() => {
    cy.clearCookies();
    cy.task('cognitoUserExistsOrCreate', adminData).then((res) => {
      cy.log(res);
      cy.visit('/');
    });
  });

  describe('Fill in form and submit', () => {
    it('.should() - make an assertion about the current subject', () => {
      cy.get('[data-cy=login_form_email_input]')
        .find('input')
        .click()
        .type(adminData.email);
      cy.get('[data-cy=login_form_password_input]')
        .find('input')
        .click()
        .type(adminData.password);
      cy.get('[data-cy=login_form_submit_button]')
        .click();
      cy.get('[data-cy=login_form_submit_button]', {timeout: 10000})
        .should('not.exist')
    });
  });
});