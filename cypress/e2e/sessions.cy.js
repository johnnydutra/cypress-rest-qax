/// <reference types="cypress"/>

describe('POST /sessions', () => {
  beforeEach(() => {
    cy.fixture('users').as('userData');
  });

  it('should authenticate user', function () {
    const data = this.userData.valid;

    cy.task('removeUser', data.email);
    cy.postUser(data);

    cy.postSession({ email: data.email, password: data.password })
      .then(response => {
        expect(response.status).to.eq(200);

        const { user, token } = response.body;

        expect(user.name).to.eq(data.name);
        expect(user.email).to.eq(data.email);
        expect(token).not.to.be.empty;
      });
  });

  it('should not authenticate with wrong password', function () {
    const data = this.userData.incorrect;

    cy.task('removeUser', data.email);
    cy.postUser(data);

    cy.postSession({ email: data.email, password: 'aaaa' })
      .then(response => {
        expect(response.status).to.eq(401);
    });
  });

  it('should not authenticate with unregistered email', function () {
    const data = this.userData.unregistered;

    cy.task('removeUser', data.email);

    cy.postSession({ email: data.email, password: data.password })
      .then(response => {
        expect(response.status).to.eq(401);
    });
  });

  it('should not authenticate when passing extra arguments', function () {
    const data = this.userData.valid;

    cy.task('removeUser', data.email);
    cy.postUser(data);

    cy.postSession(data)
      .then(response => {
        expect(response.status).to.eq(400);
      });
  });
});