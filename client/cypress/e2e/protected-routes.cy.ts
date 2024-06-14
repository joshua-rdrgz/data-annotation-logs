describe('Authentication Flow', () => {
  /**
   * Redirects unauthenticated user to login
   */
  it('Should redirect to login page if user is not authenticated', () => {
    cy.intercept('GET', '/api/v1/users/me', { statusCode: 401 });
    cy.visit('/app/dashboard');
    cy.url().should('include', '/login');
  });

  /**
   * Grants authenticated user access to dashboard
   */
  it('Should grant access to dashboard page if user is authenticated', () => {
    cy.intercept('GET', '/api/v1/users/me', {
      body: {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
      },
    });
    cy.visit('/app/dashboard');
    cy.location('pathname').should('eq', '/app/dashboard');
  });
});
