describe('GET /tasks', () => {
  beforeEach(function () {
    cy.fixture('tasks/get').then(function (tasks) {
      this.tasks = tasks;
    })
  });

  it('should get my tasks', function () {
    const { user, tasks } = this.tasks.list;
    
    cy.task('removeTasksLike', 'S7udy');
    cy.task('removeUser', user.email);

    cy.postUser(user);
    cy.postSession(user)
      .then(respUser => {
        tasks.forEach(function(task) {
          cy.postTask(respUser.body.token, task);
        });

        cy.getTasks(respUser.body.token)
          .then(response => {
            expect(response.status).to.eq(200)
        }).its('body')
          .should('be.an', 'array')
          .and('have.length', tasks.length)
      });
  });
});

describe('GET /tasks/:id', () => {
  beforeEach(function () {
    cy.fixture('tasks/get').then(function (tasks) {
      this.tasks = tasks;
    });
  });

  it('should get unique task given its id', function () {
    const { user, task } = this.tasks.unique;

    cy.task('removeTask', user.email, task.name);
    cy.task('removeUser', user.email);
    cy.postUser(user);

    cy.postSession(user)
      .then(userResp => {
        const token = userResp.body.token;
        
        cy.postTask(token, task)
          .then(taskResp => {
            cy.getTaskById(taskResp.body._id, token)
              .then(getResp => {
                expect(getResp.status).to.eq(200);
              });
          });
      });
  });

  it('should not find inexistent task', function () {
    const { user, task } = this.tasks.not_found;

    cy.task('removeTask', user.email, task.name);
    cy.task('removeUser', user.email);
    cy.postUser(user);

    cy.postSession(user)
      .then(userResp => {
        const token = userResp.body.token;
        
        cy.postTask(token, task)
          .then(taskResp => {
            const taskId = taskResp.body._id;
            cy.deleteTaskById(taskId, token)
              .then(deleteResp => {
                expect(deleteResp.status).to.eq(204);
                cy.getTaskById(taskId, token)
                  .then(getResp => {
                    expect(getResp.status).to.eq(404);
                  });
              });
          });
      });
  });
});