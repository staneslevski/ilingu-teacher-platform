const signUpForTrialClass = () => {
  context('Sign up for trial class', () => {
    describe('Implicit Assertions', () => {
      // let user = Cypress.env('testStudent');
      // let timezone = "Europe/London";
      let timezone = "Asia/Shanghai";
      it('is loading', () => {
        // wait for the root element to load and then get page
        cy.get('#root', { timeout: 20000 });
        cy.window().its('store').invoke('getState')
          .its('userInfo')
          .its('isLoadingStudent').should('equal', true);
      });

      it('navbar is accessible and my ilingu can be clicked', () => {
        cy.get('#root', {timeout: 20000})
          .find('header')
          .find('button')
          .last()
          .should('have.text', 'My iLingu')
          .click();
      });

      it('store contains userInfo.student', () => {
        cy.window().its('store').invoke('getState')
          .its('userInfo')
          .its('student').should('exist');
      });

      it('student area section is accessible, and contains correct elements', () => {
        cy.get('#menu-list')
          .find('li').first()
          .should('have.text', 'Student Area')
          .next().as('profile_li').should('have.text', 'Profile')
        // .and('have.attr', 'href')
        // .and('include', '/student/profile')
          .next().as('my_courses_li').should('have.text', 'My Courses')
        // .and('have.attr', 'href')
        // .and('include', '/student/courses')
          .next().as('billing_li').should('have.text', 'Billing')
        // .and('have.attr', href)
        // .and('include', 'Billing')
      });

      it('my Courses button takes you to my courses page', () => {
        cy.get('#menu-list').find('li').first().next().next().click();
        cy.get('#trial_lesson_start_booking', {timeout: 10000})
          .should('exist')
          .click();
      });

      it('fill in the form', () => {
        cy.get('#studyHistory')
          .type('This is my study history', { force: true });
        cy.get('#trail_class_wizard')
          .should('exist')
          .find('button')
          .last()
          .should('have.text', 'Next')
          .click();
        cy.get('#timezone_select_grid_item')
          .click()
          .find('input')
          .type(`${timezone}{enter}`, { force: true });
        cy.get('#trail_class_wizard')
          .should('exist')
          .find('button')
          .last()
          .should('have.text', 'Next')
          .click();
        // choose age
        cy.get('input[value="22 to 30"]')
          .should('exist')
          .click();
        cy.get('#otherLanguages')
          .type('I only speak ORK!!!!!!!!');
        cy.get('#trail_class_wizard')
          .should('exist')
          .find('button')
          .last()
          .should('have.text', 'Next')
          .click();
        cy.get('#motivation')
          .type('I learn Chinese so I can take over this puny planet and crush all of you!', { force: true });
        cy.get('#trail_class_wizard')
          .should('exist')
          .find('button')
          .last()
          .should('not.have.text', 'Next')
          .click();
      });
      // cy.wait(10000)
      // cy.window({timeout: 10000}).its('store').invoke('getState')
      //   .its('userInfo')
      //   .its('student').its('studentTimezone').should('equal', `${timezone}`);
      it('proceed to choose teacher', () => {
        cy.get('#choose_teacher_button').as('choose_teacher_button')
          .and('have.text', 'OK');
        cy.get('@choose_teacher_button').click();
      });

      it('check the page has progressed', () => {
        cy.get('#teachers_cards').should('exist')
          .find('button')
          .click();
        cy.get('#openCalendarButton').should('exist').click();
        cy.get('#schedule-availability').find('tr').should('exist');
        cy.wait(10000);
      });
    })
  })
};

export {signUpForTrialClass}