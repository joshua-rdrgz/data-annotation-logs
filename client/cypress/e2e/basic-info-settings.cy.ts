import { UserDTO } from '../../src/api/user/types';

describe('Basic Info Form', () => {
  let userData: UserDTO;

  beforeEach(() => {
    cy.fixture<UserDTO>('user').then((fixtureData) => {
      userData = fixtureData;
      cy.intercept('GET', '/api/v1/users/me', { body: userData }).as('getUser');
    });
    cy.visit('/app/settings');
    cy.wait('@getUser');
  });

  /**
   * Verifies that the form is pre-populated with user data and the update button is initially disabled.
   */
  it('should pre-populate form with user data and have update button disabled initially', () => {
    // Check input values
    cy.get('input[name="firstName"]').should('have.value', userData.firstName);
    cy.get('input[name="lastName"]').should('have.value', userData.lastName);
    cy.contains('button', 'Update Settings').should('be.disabled');
  });

  /**
   * Tests the enabling and disabling of the update button based on form changes.
   */
  it('should enable and disable update button based on form changes', () => {
    const testChange = (
      inputName: string,
      originalValue: string,
      newValue: string,
    ) => {
      cy.get(`input[name="${inputName}"]`).as('input');
      cy.get('@input').clear().type(newValue);
      cy.contains('button', 'Update Settings').should('be.enabled');
      cy.get('@input').clear().type(originalValue);
      cy.contains('button', 'Update Settings').should('be.disabled');
    };

    testChange('firstName', userData.firstName, 'Jane');
    testChange('lastName', userData.lastName, 'Smith');
  });

  /**
   * Verifies that user info is updated and a toast is shown on successful update.
   */
  it('should update user info and show toast on successful update', () => {
    const newFirstName = 'Jane';
    const newLastName = 'Smith';

    // Intercept API calls
    cy.intercept('PUT', '/api/v1/users/me', (req) => {
      req.reply({
        statusCode: 200,
        body: {
          ...userData,
          firstName: newFirstName,
          lastName: newLastName,
        },
      });
    }).as('updateUser');

    cy.intercept('GET', '/api/v1/users/me', (req) => {
      req.reply({
        statusCode: 200,
        body: {
          ...userData,
          firstName: newFirstName,
          lastName: newLastName,
        },
      });
    }).as('getUserUpdated');

    // Update form
    cy.get('input[name="firstName"]').clear().type(newFirstName);
    cy.get('input[name="lastName"]').clear().type(newLastName);
    cy.contains('button', 'Update Settings').click();

    // Check results
    cy.wait('@updateUser');
    cy.wait('@getUserUpdated');
    cy.get('.react-hot-toast').should('have.length.greaterThan', 0);
    cy.contains('button', 'Update Settings').should('be.disabled');
  });
});
