describe('Login Page', () => {
  beforeEach(() => {
    cy.visit('/login');
  });

  /**
   * Tests navigation from login to register page
   */
  it('should navigate to the register page when clicking the signup link', () => {
    cy.contains('Sign up here').click();
    cy.url().should('include', '/signup');
  });

  /**
   * Tests successful login and redirection
   */
  it('should successfully log in and redirect to the dashboard', () => {
    // Intercept login request
    cy.intercept('POST', '/api/v1/auth/login', {
      statusCode: 200,
      body: { status: 'success', message: 'Logged in successfully' },
    }).as('loginRequest');

    // Intercept user data request
    cy.intercept('GET', '/api/v1/users/me', {
      statusCode: 200,
      body: { id: '1', email: 'test@example.com', name: 'Test User' },
    }).as('getUserRequest');

    // Input
    cy.get('input[name="email"]').type('test@example.com');
    cy.get('input[name="password"]').type('password123');
    cy.get('button[type="submit"]').click();

    // Assert
    cy.wait('@loginRequest');
    cy.wait('@getUserRequest');
    cy.url().should('include', '/app/dashboard');
  });

  /**
   * Tests field error visibility and submit button state
   */
  it('should show and hide field errors correctly', () => {
    const emailInput = () => cy.get('input[name="email"]');
    const passwordInput = () => cy.get('input[name="password"]');
    const submitButton = () => cy.get('button[type="submit"]');

    // Initial state
    submitButton().should('be.disabled');

    // Invalid email
    emailInput().type('invalid-email');
    cy.contains('Invalid email address').should('be.visible');

    // Valid email
    emailInput().clear().type('valid@email.com');
    cy.contains('Invalid email address').should('not.exist');

    // Short password
    passwordInput().type('short');
    cy.contains('Password must be at least 8 characters').should('be.visible');

    // Valid password
    passwordInput().clear().type('validpassword123');
    cy.contains('Password must be at least 8 characters').should('not.exist');

    // Button enabled
    submitButton().should('not.be.disabled');
  });

  /**
   * Tests error message for invalid credentials
   */
  it('should show an error message for invalid credentials', () => {
    // Intercept
    cy.intercept('POST', '/api/v1/auth/login', {
      statusCode: 401,
      body: { status: 'error', message: 'Invalid email or password' },
    }).as('loginRequest');

    // Input
    cy.get('input[name="email"]').type('wrong@email.com');
    cy.get('input[name="password"]').type('wrongpassword');
    cy.get('button[type="submit"]').click();

    // Assert
    cy.wait('@loginRequest');
    cy.contains('Invalid email or password').should('be.visible');
  });

  /**
   * Tests generic error message for server errors
   */
  it('should show a generic error message for server errors', () => {
    // Intercept
    cy.intercept('POST', '/api/v1/auth/login', {
      statusCode: 500,
      body: { status: 'error' },
    }).as('loginRequest');

    // Input
    cy.get('input[name="email"]').type('test@example.com');
    cy.get('input[name="password"]').type('password123');
    cy.get('button[type="submit"]').click();

    // Assert
    cy.wait('@loginRequest');
    cy.contains('An error occurred during login.').should('be.visible');
  });
});
