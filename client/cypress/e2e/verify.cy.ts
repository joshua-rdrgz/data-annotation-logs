describe('Verify Page', () => {
  beforeEach(() => {
    cy.intercept('POST', '/api/v1/auth/verify*', (req) => {
      const { token, userId } = req.query;
      if (token === 'valid_token' && userId === 'valid_user_id') {
        req.reply({
          statusCode: 200,
          body: {
            status: 'success',
            message: 'Account verified successfully.',
          },
        });
      } else {
        req.reply({
          statusCode: 400,
          body: {
            status: 'error',
            message: 'Invalid verification token or user ID.',
          },
        });
      }
    }).as('verifyRequest');
  });

  /**
   * Tests redirection to resend verification page when token or userId is missing
   */
  it('should redirect to resend verification page if token or userId is missing', () => {
    // Visit page
    cy.visit('/verify');

    // Assert redirection
    cy.url().should('include', '/resend-verification');
    cy.contains('Invalid verification link.').should('be.visible');
  });

  /**
   * Tests successful user verification and redirection to login page
   */
  it('should successfully verify user and redirect to login page', () => {
    // Visit page
    cy.visit('/verify?token=valid_token&userId=valid_user_id');

    // Wait for request
    cy.wait('@verifyRequest');

    // Assert redirection
    cy.url().should('include', '/login');
    cy.contains('Account verified successfully.').should('be.visible');
  });

  /**
   * Tests verification failure handling and redirection to resend verification page
   */
  it('should handle verification failure and redirect to resend verification page', () => {
    // Visit page
    cy.visit('/verify?token=invalid_token&userId=invalid_user_id');

    // Wait for request
    cy.wait('@verifyRequest');

    // Assert redirection
    cy.url().should('include', '/resend-verification');
    cy.contains('Failed to verify account.').should('be.visible');
  });
});
