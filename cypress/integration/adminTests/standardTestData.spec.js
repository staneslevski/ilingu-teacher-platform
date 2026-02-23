import adminData from "../../fixtures/admins/adminUserData";
import {logIn} from "../../support/TestAsAFunction/Auth/login";

context('Assertions', () => {
  before(() => {
    cy.clearCookies();
    cy.task('seedData', 'standardTestData').then((res) => {
      cy.log(res);
      cy.task('createAndConfirmUser', 'admin').then(res => {
        cy.log(res);
        cy.visit('/');
        logIn(adminData);
      });
    })
  });

  describe('navigate to courses page, pick one, and delete it', () => {
    it('.should() - make an assertion about the current subject', () => {
      // cy.get('li')
      //   .contains('Teachers')
      //   .should('exist')
      //   .click();
      // cy.get('li')
      //   .contains('Teacher List')
      //   .should('exist')
      //   .click();
      // cy.get('[data-cy=teacher_list_actions_section]', {timeout: 10000})
      //   .its('length')
      //   .should('equal', 4);
      // cy.get('li')
      //   .contains('Courses')
      //   .click();
      // cy.get('li')
      //   .contains('Lesson List')
      //   .should('exist')
      //   .click();
      // cy.get('[data-cy=course_testing_anchor]')
      //   .its('length')
      //   .should('equal', 3);
      // cy.get('[data-cy=course_testing_anchor]').eq(2).click();
      // cy.get('[data-cy=admin_course_info_accordion]')
      //   .contains('Destructive course actions')
      //   .click();
      // cy.get('[data-cy=admin_delete_course_button]')
      //   .click();
      // cy.get('button')
      //   .contains('Cancel')
      //   .click();
    });
  });
});