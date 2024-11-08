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
      name: 'Duplication Test',
      email: 'duplication@test.com',
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

  context('mandatory fields check', () => {
    let user;

    beforeEach(() => {
      user = {
        name: 'Mandatory Test',
        email: 'mandatory@test.com',
        password: 'qax123'
      };
    });

    it('name is required', () => {
      delete user.name;
      cy.postUser(user)
        .then(response => {
          const { message } = response.body;
          expect(response.status).to.eq(400);
          expect(message).to.eq('ValidationError: \"name\" is required');
        });
    });
    
    it('email is required', () => {
      delete user.email;
      cy.postUser(user)
        .then(response => {
          const { message } = response.body;
          expect(response.status).to.eq(400);
          expect(message).to.eq('ValidationError: \"email\" is required');
        });
    });

    it('password is required', () => {
      delete user.password;
      cy.postUser(user)
        .then(response => {
          const { message } = response.body;
          expect(response.status).to.eq(400);
          expect(message).to.eq('ValidationError: \"password\" is required');
        });
    });

  });
});

