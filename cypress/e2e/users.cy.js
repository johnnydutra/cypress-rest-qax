/// <reference types="cypress"/>

describe('POST /users', () => {
  it('should register a new user', () => {

    const user = {
      name: 'Cypress Test',
      email: 'cypress@test.com',
      password: 'qax123'
    };

    cy.task('deleteUser', user.email);
    
    cy.postUser(user)
      .then(response => {
        expect(response.status).to.eq(200);
      });
  });

  it('should not register an user with duplicated email', () => {

    const user = {
      name: 'Cypress Test',
      email: 'cypress@test.com',
      password: 'qax123'
    };

    cy.task('deleteUser', user.email);

    cy.postUser(user);
    
    cy.postUser(user)
      .then(response => {
        const { message } = response.body;
        expect(response.status).to.eq(409);
        expect(message).to.eq('Duplicated email!');
      });
  });
});

