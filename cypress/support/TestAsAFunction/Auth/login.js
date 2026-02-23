export const logIn = (userData) => {
  cy.get('[data-cy=login_form_email_input]')
    .find('input')
    .click()
    .type(userData.email);
  cy.get('[data-cy=login_form_password_input]')
    .find('input')
    .click()
    .type(userData.password);
  cy.get('[data-cy=login_form_submit_button]')
    .click();
  cy.get('[data-cy=login_form_submit_button]', {timeout: 20000})
    .should('not.exist')
};