describe('Signup Page', () => {
  beforeEach(() => {
    cy.visit('/signup');
  });

  /**
   * Tests if clicking the login link redirects the user to the login page.
   */
  it('should redirect to login page when clicking the login link', () => {
    cy.get('a[href="/login"]').click();
    cy.url().should('include', '/login');
  });

  /**
   * Tests the successful user registration process, including form submission
   * and redirection to the signup success page.
   */
  it('should successfully sign up a new user', () => {
    // Intercept API request
    cy.intercept('POST', '/api/v1/auth/register', {
      statusCode: 200,
      body: {
        status: 'success',
        message: 'User registered successfully',
      },
    }).as('signupRequest');

    // Fill out form
    cy.get('input[name="firstName"]').type('John');
    cy.get('input[name="lastName"]').type('Doe');
    cy.get('input[name="email"]').type('johndoe@example.com');
    cy.get('input[name="password"]').type('password123');

    // Submit form
    cy.get('button[type="submit"]').click();

    // Wait for API response
    cy.wait('@signupRequest');

    // Check redirection
    cy.url().should('include', '/signup-success');
  });

  /**
   * Tests the form validation for all input fields, including error messages
   * for invalid inputs and the submit button's disabled state.
   */
  it('should display validation errors correctly and enable submit when valid', () => {
    // Check initial button state
    cy.get('button[type="submit"]').should('be.disabled');

    // First Name validation
    cy.get('input[name="firstName"]').type('J').clear();
    cy.contains('First name is required').should('be.visible');
    cy.get('input[name="firstName"]').type('John');
    cy.contains('First name is required').should('not.exist');

    // Last Name validation
    cy.get('input[name="lastName"]').type('D').clear();
    cy.contains('Last name is required').should('be.visible');
    cy.get('input[name="lastName"]').type('Doe');
    cy.contains('Last name is required').should('not.exist');

    // Email validation
    cy.get('input[name="email"]').type('invalid');
    cy.contains('Invalid email address').should('be.visible');
    cy.get('input[name="email"]').clear().type('valid@email.com');
    cy.contains('Invalid email address').should('not.exist');

    // Password validation
    cy.get('input[name="password"]').type('short');
    cy.contains('Password must be at least 8 characters').should('be.visible');
    cy.get('input[name="password"]').clear().type('validpassword');
    cy.contains('Password must be at least 8 characters').should('not.exist');

    // Check final button state
    cy.get('button[type="submit"]').should('not.be.disabled');
  });

  /**
   * Tests the error handling for a signup attempt with an existing email,
   * including the display of the error message from the server.
   */
  it('should handle signup error', () => {
    // Intercept API request
    cy.intercept('POST', '/api/v1/auth/register', {
      statusCode: 400,
      body: {
        status: 'error',
        message: 'Email already exists',
      },
    }).as('signupError');

    // Fill out form
    cy.get('input[name="firstName"]').type('John');
    cy.get('input[name="lastName"]').type('Doe');
    cy.get('input[name="email"]').type('existing@example.com');
    cy.get('input[name="password"]').type('password123');

    // Submit form
    cy.get('button[type="submit"]').click();

    // Wait for API response
    cy.wait('@signupError');

    // Check error message
    cy.contains('Email already exists').should('be.visible');
  });
});
