import { UserDTO } from '../../src/api/user/types';

describe('Email Change and Verification', () => {
  describe('Change Email Form', () => {
    let userData: UserDTO;

    beforeEach(() => {
      cy.fixture<UserDTO>('user').then((fixtureData) => {
        userData = fixtureData;
        cy.intercept('GET', '/api/v1/users/me', { body: userData }).as(
          'getUser',
        );
      });
      cy.visit('/app/settings');
      cy.wait('@getUser');
    });

    /**
     * Verifies that the form is pre-populated with user email and the update button is initially disabled.
     */
    it('should pre-populate form with user email and have update button disabled initially', () => {
      cy.get('input[name="email"]').should('have.value', userData.email);
      cy.contains('button', 'Update Email').should('be.disabled');
    });

    /**
     * Tests the enabling and disabling of the update button based on email changes.
     */
    it('should enable and disable update button based on email changes', () => {
      const newEmail = 'new.email@example.com';
      cy.get('input[name="email"]').as('emailInput');

      // Test email change
      cy.get('@emailInput').clear().type(newEmail);
      cy.contains('button', 'Update Email').should('be.enabled');

      cy.get('@emailInput').clear().type(userData.email);
      cy.contains('button', 'Update Email').should('be.disabled');
    });

    /**
     * Verifies that a toast is shown and the form is disabled on successful email update request.
     */
    it('should show toast and disable form on successful email update request', () => {
      const newEmail = 'new.email@example.com';

      // Intercept API calls
      cy.intercept('PUT', '/api/v1/users/me/email', {
        statusCode: 200,
        body: {
          httpStatusCode: '200',
          status: 'success',
          message: 'Email change request sent',
        },
      }).as('updateEmail');

      cy.intercept('GET', '/api/v1/users/me', (req) => {
        req.reply({
          statusCode: 200,
          body: {
            ...userData,
            pendingEmailChange: true,
            pendingEmail: newEmail,
          },
        });
      }).as('getUserUpdated');

      // Update email
      cy.get('input[name="email"]').clear().type(newEmail);
      cy.contains('button', 'Update Email').click();

      // Check results
      cy.wait('@updateEmail');
      cy.wait('@getUserUpdated');
      cy.get('.react-hot-toast').should('have.length.greaterThan', 0);
      cy.get('input[name="email"]').should('be.disabled');
      cy.contains('button', 'Update Email').should('be.disabled');
      cy.contains(newEmail).should('be.visible');
    });
  });

  describe('Email Verification Page', () => {
    beforeEach(() => {
      Cypress.on('uncaught:exception', () => false);
    });

    /**
     * Tests the error page display when URL parameters are missing.
     */
    it('should show error page when URL parameters are missing', () => {
      cy.visit('/verify-email-change');
      cy.contains('Uh oh, something went wrong!').should('be.visible');
    });

    /**
     * Tests the error page display when URL parameters are invalid.
     */
    it('should show error page when URL parameters are invalid', () => {
      cy.intercept('PUT', '/api/v1/users/email/verify', {
        statusCode: 400,
        body: {
          message: 'Invalid token or userId',
        },
      }).as('verifyEmail');

      cy.visit('/verify-email-change?userId=invalid&token=invalid');
      cy.wait('@verifyEmail');
      cy.contains('Uh oh, something went wrong!').should('be.visible');
    });

    /**
     * Verifies logout and redirection to login page on successful email verification.
     */
    it('should logout and redirect to login page on successful verification', () => {
      // Intercept API calls
      cy.intercept('PUT', '/api/v1/users/email/verify', {
        statusCode: 200,
        body: {
          httpStatusCode: '200',
          status: 'success',
          message: 'Email verified successfully',
        },
      }).as('verifyEmail');

      cy.intercept('GET', '/api/v1/auth/logout', {
        statusCode: 200,
        body: {
          statusCode: '200',
          status: 'success',
          message: 'Logged out successfully',
        },
      }).as('logout');

      // Visit verification page
      cy.visit('/verify-email-change?userId=validUser&token=validToken');
      cy.url().should('include', '/login');
      cy.get('.react-hot-toast').should('have.length.greaterThan', 0);
    });
  });
});
