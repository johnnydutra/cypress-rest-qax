describe('PUT /tasks/:id/done', () => {
  beforeEach(function () {
    cy.fixture('tasks/put').then(function (tasks) {
      this.tasks = tasks;
    })
  });

  it('should update task status to done', function () {
    const { user, task } = this.tasks.update;

    cy.task('removeTask', task.name, user.email);
    cy.task('removeUser', user.email);
    cy.postUser(user);

    cy.postSession(user)
      .then(sessionResp => {
        const token = sessionResp.body.token;
        cy.postTask(token, task)
          .then(taskResp => {
            const taskId = taskResp.body._id
            cy.putTaskDone(taskId, token)
              .then(putResp => {
                expect(putResp.status).to.eq(204);
              });
              cy.getTaskById(taskId, token)
                .then(getResp => {
                  expect(getResp.body.is_done).to.be.true;
                })
          })
      })
  });
});