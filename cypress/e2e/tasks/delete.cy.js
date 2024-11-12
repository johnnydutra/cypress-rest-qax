describe('DELETE /tasks', () => {
  beforeEach(function () {
    cy.fixture('tasks/delete').then(function (tasks) {
      this.tasks = tasks;
    })
  });

  it('should delete a task', function () {
    const { user, task } = this.tasks.remove;

    cy.task('removeTask', task.name, user.email);
    cy.task('removeUser', user.email);
    cy.postUser(user);

    cy.postSession(user)
      .then(sessionResp => {
        const token = sessionResp.body.token;
        cy.postTask(token, task)
          .then(taskResp => {
            cy.deleteTaskById(taskResp.body._id, token)
              .then(deleteResp => {
                expect(deleteResp.status).to.eq(204);
              })
          })
      })
  });

  it('should return correctly when trying to delete an inexistent task', function () {
    const { user, task } = this.tasks.not_found;

    cy.task('removeTask', task.name, user.email);
    cy.task('removeUser', user.email);
    cy.postUser(user);

    cy.postSession(user)
      .then(sessionResp => {
        const token = sessionResp.body.token;
        cy.postTask(token, task)
          .then(taskResp => {
            cy.deleteTaskById(taskResp.body._id, token)
              .then(deleteResp => {
                expect(deleteResp.status).to.eq(204);
              })
            cy.deleteTaskById(taskResp.body._id, token)
              .then(deleteResp => {
                expect(deleteResp.status).to.eq(404);
              })
          })
      })
    });
});