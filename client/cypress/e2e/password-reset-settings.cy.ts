import { PasswordResetStatus, UserDto } from '../../src/api/user/types';
import { PasswordResetTestIds } from '../../src/features/user/testIds';

describe('Password Reset Flow', () => {
  let userData: UserDto;

  beforeEach(() => {
    cy.fixture<UserDto>('user').then((fixtureData) => {
      userData = {
        ...fixtureData,
        passwordResetStatus: PasswordResetStatus.INACTIVE,
      };
      cy.intercept('GET', '/api/v1/users/me', { body: userData }).as('getUser');
    });
    cy.visit('/app/settings');
    cy.wait('@getUser');
  });

  describe('Initiate Password Reset', () => {
    /**
     * Tests successful initiation of password reset process by clicking the button and verifies the state change to OTP_SENT
     */
    it('starts password reset process', () => {
      // Setup
      cy.intercept('PUT', '/api/v1/users/me/password', {
        statusCode: 200,
        body: { message: 'OTP sent successfully' },
      }).as('sendOtp');
      cy.intercept('GET', '/api/v1/users/me', {
        ...userData,
        passwordResetStatus: PasswordResetStatus.OTP_SENT,
      }).as('getUserAfterOtpSent');

      // Action
      cy.get(`[data-testid="${PasswordResetTestIds.InitiateButton}"]`).click();

      // Assertion
      cy.wait('@sendOtp');
      cy.wait('@getUserAfterOtpSent');
      cy.get('.react-hot-toast').should('exist');
      cy.get(`[data-testid="${PasswordResetTestIds.OtpInput}"]`).should(
        'exist',
      );
    });

    /**
     * Tests the app's behavior when password reset initiation fails by simulating an error response and verifying correct error handling
     */
    it('shows error on reset initiation failure', () => {
      // Setup
      cy.intercept('PUT', '/api/v1/users/me/password', {
        statusCode: 400,
        body: { message: 'Unable to initiate password reset' },
      }).as('sendOtpError');

      // Action
      cy.get(`[data-testid="${PasswordResetTestIds.InitiateButton}"]`).click();

      // Assertion
      cy.wait('@sendOtpError');
      cy.get('.react-hot-toast').should(
        'contain',
        'Unable to initiate password reset',
      );
      cy.get(`[data-testid="${PasswordResetTestIds.OtpInput}"]`).should(
        'not.exist',
      );
    });
  });

  describe('OTP Verification', () => {
    beforeEach(() => {
      cy.intercept('GET', '/api/v1/users/me', {
        ...userData,
        passwordResetStatus: PasswordResetStatus.OTP_SENT,
      }).as('getUserWithOtpSent');
      cy.visit('/app/settings');
      cy.wait('@getUserWithOtpSent');
    });

    /**
     * Tests the successful verification of the OTP by submitting a valid code,
     * ensuring the state transitions correctly and the password change form is displayed.
     */
    it('successfully verifies OTP', () => {
      // Setup
      const otp = '123456';
      cy.intercept('PUT', '/api/v1/users/me/password/verify', {
        statusCode: 200,
        body: { message: 'OTP verified successfully' },
      }).as('verifyOtp');
      cy.intercept('GET', '/api/v1/users/me', {
        ...userData,
        passwordResetStatus: PasswordResetStatus.OTP_VERIFIED,
      }).as('getUserAfterOtpVerified');

      // Action
      cy.get(`[data-testid="${PasswordResetTestIds.OtpInput}"]`).type(otp);
      cy.get(`[data-testid="${PasswordResetTestIds.OtpVerifyButton}"]`).click();

      // Assertion
      cy.wait('@verifyOtp');
      cy.wait('@getUserAfterOtpVerified');
      cy.get('.react-hot-toast').should('exist');
      cy.get(`[data-testid="${PasswordResetTestIds.NewPasswordInput}"]`).should(
        'exist',
      );
    });

    /**
     * Tests the OTP verification failure scenario by submitting an incorrect code,
     * ensuring an error message is displayed and the OTP form remains visible.
     */
    it('shows error on incorrect OTP', () => {
      // Setup
      const otp = '123457';
      cy.intercept('PUT', '/api/v1/users/me/password/verify', {
        statusCode: 400,
        body: { message: 'Invalid OTP' },
      }).as('verifyOtp');

      // Action
      cy.get(`[data-testid="${PasswordResetTestIds.OtpInput}"]`).type(otp);
      cy.get(`[data-testid="${PasswordResetTestIds.OtpVerifyButton}"]`).click();

      // Assertion
      cy.wait('@verifyOtp');
      cy.get('.react-hot-toast').should('exist');
      cy.get(`[data-testid="${PasswordResetTestIds.OtpInput}"]`).should(
        'exist',
      );
    });
  });

  describe('Password Change', () => {
    beforeEach(() => {
      cy.intercept('GET', '/api/v1/users/me', {
        ...userData,
        passwordResetStatus: PasswordResetStatus.OTP_VERIFIED,
      }).as('getUserWithOtpVerified');
      cy.visit('/app/settings');
      cy.wait('@getUserWithOtpVerified');
    });

    /**
     * Tests the complete password change flow where a user enters a new password,
     * submits the form, and the password is successfully changed. It also verifies
     * the cooldown warning is displayed and the user state is updated correctly.
     */
    it('successfully changes password', () => {
      // Setup
      const newPassword = 'NewSecurePassword123!';
      cy.intercept('PUT', '/api/v1/users/me/password/change', {
        statusCode: 200,
        body: { message: 'Password changed successfully' },
      }).as('changePassword');
      cy.intercept('GET', '/api/v1/users/me', {
        ...userData,
        passwordResetStatus: PasswordResetStatus.OTP_COMPLETE_COOLDOWN,
        cooldownMinsRemaining: 1440,
      }).as('getUserAfterPasswordChange');

      // Action
      cy.get(`[data-testid="${PasswordResetTestIds.NewPasswordInput}"]`).type(
        newPassword,
      );
      cy.get(
        `[data-testid="${PasswordResetTestIds.ConfirmPasswordInput}"]`,
      ).type(newPassword);
      cy.get(
        `[data-testid="${PasswordResetTestIds.ChangePasswordButton}"]`,
      ).click();

      // Assertion
      cy.wait('@changePassword');
      cy.wait('@getUserAfterPasswordChange');
      cy.get('.react-hot-toast').should('exist');
      cy.get(`[data-testid="${PasswordResetTestIds.CooldownWarning}"]`).should(
        'exist',
      );
    });

    /**
     * Tests the app's behavior when password change request fails by simulating an error response and verifying the UI remains unchanged
     */
    it('shows error on password change failure', () => {
      // Setup
      const newPassword = 'NewSecurePassword123!';
      cy.intercept('PUT', '/api/v1/users/me/password/change', {
        statusCode: 400,
        body: { message: 'Password change failed' },
      }).as('changePasswordError');

      // Action
      cy.get(`[data-testid="${PasswordResetTestIds.NewPasswordInput}"]`).type(
        newPassword,
      );
      cy.get(
        `[data-testid="${PasswordResetTestIds.ConfirmPasswordInput}"]`,
      ).type(newPassword);
      cy.get(
        `[data-testid="${PasswordResetTestIds.ChangePasswordButton}"]`,
      ).click();

      // Assertion
      cy.wait('@changePasswordError');
      cy.get('.react-hot-toast').should('contain', 'Password change failed');
      cy.get(`[data-testid="${PasswordResetTestIds.NewPasswordInput}"]`).should(
        'exist',
      );
    });
  });

  describe('Cooldown States', () => {
    /**
     * Tests the display of the OTP timeout cooldown warning by simulating a cooldown state and verifying the warning content
     */
    it('shows OTP timeout warning', () => {
      // Setup
      cy.intercept('GET', '/api/v1/users/me', {
        ...userData,
        passwordResetStatus: PasswordResetStatus.OTP_TIMEOUT_COOLDOWN,
        cooldownMinsRemaining: 15,
      }).as('getUserWithOtpTimeoutCooldown');

      // Action
      cy.visit('/app/settings');
      cy.wait('@getUserWithOtpTimeoutCooldown');

      // Assertion
      cy.get(`[data-testid="${PasswordResetTestIds.CooldownWarning}"]`)
        .should('exist')
        .and('contain', '15 minutes');
      cy.get(`[data-testid="${PasswordResetTestIds.InitiateButton}"]`).should(
        'be.disabled',
      );
    });

    /**
     * Tests the display of the password change complete cooldown warning by simulating a cooldown state and verifying the warning content
     */
    it('shows password change complete cooldown warning', () => {
      // Setup
      cy.intercept('GET', '/api/v1/users/me', {
        ...userData,
        passwordResetStatus: PasswordResetStatus.OTP_COMPLETE_COOLDOWN,
        cooldownMinsRemaining: 1440,
      }).as('getUserWithCompleteCooldown');

      // Action
      cy.visit('/app/settings');
      cy.wait('@getUserWithCompleteCooldown');

      // Assertion
      cy.get(`[data-testid="${PasswordResetTestIds.CooldownWarning}"]`)
        .should('exist')
        .and('contain', '24 hours');
      cy.get(`[data-testid="${PasswordResetTestIds.InitiateButton}"]`).should(
        'be.disabled',
      );
    });
  });
});
