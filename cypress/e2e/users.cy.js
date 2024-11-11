/// <reference types="cypress"/>

describe('POST /users', () => {
  it('should register a new user', () => {
    cy.fixture('users').then(data => {
      cy.task('deleteUser', data.new.email);
      cy.postUser(data.new).then(response => {
        expect(response.status).to.eq(200);
        expect(response.body.name).to.eq(data.new.name);
      });
    });
  });

  it('should not register an user with duplicated email', () => {
    cy.fixture('users').then(data => {
      cy.task('deleteUser', data.duplicated.email);
      cy.postUser(data.duplicated);
      cy.postUser(data.duplicated).then(response => {
        const { message } = response.body;
        expect(response.status).to.eq(409);
        expect(message).to.eq('Duplicated email!');
      });
    });
  });

  context('mandatory fields check', () => {
    let mandatory;

    beforeEach(() => {
      cy.fixture('users').then(function (users) {
        this.users = users;
        mandatory = this.users.mandatory;
      });
    });

    it('name is required', () => {
      delete mandatory.name;
      cy.postUser(mandatory)
        .then(response => {
          const { message } = response.body;
          expect(response.status).to.eq(400);
          expect(message).to.eq('ValidationError: \"name\" is required');
        });
    });
    
    it('email is required', () => {
      delete mandatory.email;
      cy.postUser(mandatory)
        .then(response => {
          const { message } = response.body;
          expect(response.status).to.eq(400);
          expect(message).to.eq('ValidationError: \"email\" is required');
        });
    });

    it('password is required', () => {
      delete mandatory.password;
      cy.postUser(mandatory)
        .then(response => {
          const { message } = response.body;
          expect(response.status).to.eq(400);
          expect(message).to.eq('ValidationError: \"password\" is required');
        });
    });

  });
});

