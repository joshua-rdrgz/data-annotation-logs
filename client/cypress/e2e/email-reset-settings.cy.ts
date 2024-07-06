import { UserDTO } from '../../src/api/user/types';
import {
  CancelEmailResetTestIds,
  UserEmailSettingsFormTestIds,
} from '../../src/features/user/testIds';

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
      cy.get(
        `[data-testid="${UserEmailSettingsFormTestIds.EmailInput}"]`,
      ).should('have.value', userData.email);
      cy.get(
        `[data-testid="${UserEmailSettingsFormTestIds.UpdateEmailButton}"]`,
      ).should('be.disabled');
    });

    /**
     * Tests the enabling and disabling of the update button based on email changes.
     */
    it('should enable and disable update button based on email changes', () => {
      const newEmail = 'new.email@example.com';

      // Test email change
      cy.get(`[data-testid="${UserEmailSettingsFormTestIds.EmailInput}"]`)
        .clear()
        .type(newEmail);
      cy.get(
        `[data-testid="${UserEmailSettingsFormTestIds.UpdateEmailButton}"]`,
      ).should('be.enabled');

      // Test reverting to original email
      cy.get(`[data-testid="${UserEmailSettingsFormTestIds.EmailInput}"]`)
        .clear()
        .type(userData.email);
      cy.get(
        `[data-testid="${UserEmailSettingsFormTestIds.UpdateEmailButton}"]`,
      ).should('be.disabled');
    });

    /**
     * Verifies the email update process, including form state changes, pending email change notification,
     * and the ability to cancel the pending change.
     */
    it('should handle email update process and cancellation correctly', () => {
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
      cy.get(`[data-testid="${UserEmailSettingsFormTestIds.EmailInput}"]`)
        .clear()
        .type(newEmail);
      cy.get(
        `[data-testid="${UserEmailSettingsFormTestIds.UpdateEmailButton}"]`,
      ).click();

      cy.wait('@updateEmail');
      cy.wait('@getUserUpdated');

      // Check results after update
      cy.get('.react-hot-toast').should('have.length.greaterThan', 0);
      cy.get(
        `[data-testid="${UserEmailSettingsFormTestIds.EmailInput}"]`,
      ).should('be.disabled');
      cy.get(
        `[data-testid="${UserEmailSettingsFormTestIds.UpdateEmailButton}"]`,
      ).should('be.disabled');
      cy.get(
        `[data-testid="${UserEmailSettingsFormTestIds.PendingEmailChangeNotification}"]`,
      ).should('be.visible');

      // Test cancellation process
      cy.get(
        `[data-testid="${CancelEmailResetTestIds.CancelEmailChangeButton}"]`,
      ).click();
      cy.get(
        `[data-testid="${CancelEmailResetTestIds.CancelEmailChangeDialog}"]`,
      ).should('be.visible');

      // Close dialog with "No" button
      cy.get(
        `[data-testid="${CancelEmailResetTestIds.CancelCancelEmailChangeButton}"]`,
      ).click();
      cy.get(
        `[data-testid="${CancelEmailResetTestIds.CancelEmailChangeDialog}"]`,
      ).should('not.exist');

      // Reopen and confirm cancellation
      cy.get(
        `[data-testid="${CancelEmailResetTestIds.CancelEmailChangeButton}"]`,
      ).click();

      // Intercept cancellation request
      cy.intercept('PUT', '/api/v1/users/me/email/cancel-reset', {
        statusCode: 200,
        body: {
          httpStatusCode: '200',
          status: 'success',
          message: 'Email change cancelled successfully',
        },
      }).as('cancelEmailChange');

      // Intercept updated user data after cancellation
      cy.intercept('GET', '/api/v1/users/me', {
        body: { ...userData, pendingEmailChange: false, pendingEmail: null },
      }).as('getUserAfterCancellation');

      // Confirm cancellation
      cy.get(
        `[data-testid="${CancelEmailResetTestIds.ConfirmCancelEmailChangeButton}"]`,
      ).click();

      // Verify API calls
      cy.wait('@cancelEmailChange');
      cy.wait('@getUserAfterCancellation');

      // Verify UI updates after cancellation
      cy.get('.react-hot-toast').should('have.length.greaterThan', 0);
      cy.get(
        `[data-testid="${UserEmailSettingsFormTestIds.PendingEmailChangeNotification}"]`,
      ).should('not.exist');
      cy.get(`[data-testid="${UserEmailSettingsFormTestIds.EmailInput}"]`)
        .should('have.value', userData.email)
        .and('not.be.disabled');
      cy.get(
        `[data-testid="${UserEmailSettingsFormTestIds.UpdateEmailButton}"]`,
      ).should('be.disabled');
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
