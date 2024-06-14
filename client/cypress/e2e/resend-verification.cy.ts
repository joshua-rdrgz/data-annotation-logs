describe('Resend Verification Page', () => {
  beforeEach(() => {
    cy.visit('/resend-verification');

    cy.intercept('POST', '/api/v1/auth/resend-verification*', (req) => {
      req.reply({
        statusCode: 200,
        body: {
          statusCode: 'OK',
          status: 'success',
          message:
            'If the email is associated with an unverified account, a verification link has been sent.',
        },
      });
    }).as('resendVerificationRequest');
  });

  /**
   * Tests form validation for email input
   */
  it('should handle form validation', () => {
    // Initial state
    cy.get('button[type="submit"]').should('be.disabled');

    // Invalid email
    cy.get('input[name="email"]').type('invalid-email');
    cy.get('input[name="email"]').blur();
    cy.contains('Invalid email address').should('be.visible');
    cy.get('button[type="submit"]').should('be.disabled');

    // Valid email
    cy.get('input[name="email"]').clear().type('valid@example.com');
    cy.contains('Invalid email address').should('not.exist');
    cy.get('button[type="submit"]').should('not.be.disabled');
  });

  /**
   * Tests form submission and success message display
   */
  it('should submit form and display success message', () => {
    // Submit form
    cy.get('input[name="email"]').type('valid@example.com');
    cy.get('button[type="submit"]').click();

    // Wait for request
    cy.wait('@resendVerificationRequest');

    // Assert success message
    cy.contains(
      'If the email is associated with an unverified account, a verification link has been sent.'
    ).should('be.visible');
  });
});
