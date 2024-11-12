describe('POST /tasks', () => {
  beforeEach(function() {
    cy.fixture('tasks/post').then(function (tasks){
      this.tasks = tasks;
    });
  });

  context('should register a new task', function () {

    before(function () {
      cy.purgeQueueMessages()
        .then(response => {
          expect(response.status).to.eq(204);
        });
    });

    it('post task', function () {
      const { user, task } = this.tasks.create;
  
      cy.task('removeUser', user.email);
      cy.postUser(user);
  
      cy.postSession(user)
        .then(sessionResp => {
          cy.task('removeTask', task.name, user.email);
          cy.postTask(sessionResp.body.token, task)
            .then(response => {
              expect(response.status).to.eq(201);
              expect(response.body.name).to.eq(task.name);
              expect(response.body.tags).to.eql(task.tags);
              expect(response.body.is_done).to.be.false;
              expect(response.body.user).to.eq(sessionResp.body.user._id);
              expect(response.body._id.length).to.eq(24);
            });
        });
    });

    after(function () {
      const { user, task } = this.tasks.create;
      cy.wait(3000);
      cy.getMessageQueue()
        .then(response => {
          expect(response.status).to.eq(200);
          expect(response.body[0].payload).to.include(user.name.split(' ')[0]);
          expect(response.body[0].payload).to.include(task.name);
          expect(response.body[0].payload).to.include(user.email);
        });
    });
  });

  it.skip('should not register a duplicated task', function () {
    const { user, task } = this.tasks.duplicated;

    cy.task('removeUser', user.email);
    cy.postUser(user);

    cy.postSession(user)
      .then(sessionResp => {
        cy.task('removeTask', task.name, user.email);
        cy.postTask(sessionResp.body.token, task);
        cy.postTask(sessionResp.body.token, task)
          .then(taskResp => {
            expect(taskResp.status).to.eq(409);
            expect(taskResp.body.message).to.eq('Duplicated task!');
          });
      });
  });
});