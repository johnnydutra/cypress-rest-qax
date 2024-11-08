/// <reference types="cypress"/>

describe('POST /users', () => {
  it('should register a new user', () => {

    const user = {
      name: 'Cypress Test',
      email: 'cypress@test.com',
      password: 'qax123'
    };

    cy.task('deleteUser', user.email);

    cy.request({
      url: '/users',
      method: 'POST',
      body: user,
      failOnStatusCode: false
    }).then((response => {
      expect(response.status).to.eq(200);
      cy.log(JSON.stringify(response.body));
    }));
  });
});