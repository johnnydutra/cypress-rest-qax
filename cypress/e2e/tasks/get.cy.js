describe('GET /tasks', () => {
  beforeEach(function () {
    cy.fixture('tasks/get').then(function (tasks) {
      this.tasks = tasks;
    })
  });

  it('should get my tasks', function () {
    const { user, tasks } = this.tasks.list;
    
    cy.task('deleteTasksLike', 'S7udy');
    cy.task('deleteUser');

    cy.postUser(user);
    cy.postSession(user)
      .then(respUser => {
        tasks.forEach(function(task) {
          cy.postTask(respUser.body.token, task);
        });

        cy.api({
          url: '/tasks',
          method: 'GET',
          headers: {
            authorization: respUser.body.token
          },
          failOnStatusCode: false
        }).then(response => {
          expect(response.status).to.eq(200)
        }).its('body')
          .should('be.an', 'array')
          .and('have.length', tasks.length)
      });
  });
});

