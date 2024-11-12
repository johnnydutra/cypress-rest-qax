describe('POST /tasks', () => {
  beforeEach(function() {
    cy.fixture('tasks/post').then(function (tasks){
      this.tasks = tasks;
    });
  });

  it('should register a new task', function () {
    const { user, task } = this.tasks.create;

    cy.task('deleteUser', user.email);
    cy.postUser(user);

    cy.postSession(user)
      .then(sessionResp => {
        cy.task('deleteTask', task.name, user.email);
        cy.postTask(sessionResp.body.token, task)
          .then(response => {
            expect(response.status).to.eq(200);
            expect(response.body.name).to.eq(task.name);
            expect(response.body.tags).to.eql(task.tags);
            expect(response.body.is_done).to.be.false;
            expect(response.body.user).to.eq(sessionResp.body.user._id);
            expect(response.body._id.length).to.eq(24);
          });
      });
  });

  it('should not register a duplicated task', function () {
    const { user, task } = this.tasks.duplicated;

    cy.task('deleteUser', user.email);
    cy.postUser(user);

    cy.postSession(user)
      .then(sessionResp => {
        cy.task('deleteTask', task.name, user.email);
        cy.postTask(sessionResp.body.token, task);
        cy.postTask(sessionResp.body.token, task)
          .then(taskResp => {
            expect(taskResp.status).to.eq(409);
            expect(taskResp.body.message).to.eq('Duplicated task!');
          });
      });
  });
});