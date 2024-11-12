Cypress.Commands.add('postUser', (user) => {
  cy.api({
    url: '/users',
    method: 'POST',
    body: user,
    failOnStatusCode: false
  }).then(response => { return response });
});

Cypress.Commands.add('postSession', (user) => {
  cy.api({
    url: '/sessions',
    method: 'POST',
    body: { email: user.email, password: user.password },
    failOnStatusCode: false
  }).then(response => { return response });
});

Cypress.Commands.add('postTask', (token, task) => {
  cy.api({
    url: '/tasks',
    method: 'POST',
    body: task,
    headers: {
      authorization: token
    },
    failOnStatusCode: false
  }).then(response => { return response });
});

Cypress.Commands.add('getTasks', (token) => {
  cy.api({
    url: '/tasks',
    method: 'GET',
    headers: {
      authorization: token
    },
    failOnStatusCode: false
  }).then(response => { return response });
});

Cypress.Commands.add('getTaskById', (taskId, token) => {
  cy.api({
    url: '/tasks/' + taskId,
    method: 'GET',
    headers: {
      authorization: token
    },
    failOnStatusCode: false
  }).then(response => { return response });
});

Cypress.Commands.add('deleteTaskById', (taskId, token) => {
  cy.api({
    url: '/tasks/' + taskId,
    method: 'DELETE',
    headers: {
      authorization: token
    },
    failOnStatusCode: false
  }).then(response => { return response });
});

Cypress.Commands.add('putTaskDone', (taskId, token) => {
  cy.api({
    url: `/tasks/${taskId}/done`,
    method: 'PUT',
    headers: {
      authorization: token
    },
    failOnStatusCode: false
  }).then(response => { return response });
});

Cypress.Commands.add('purgeQueueMessages', () => {
  cy.api({
    url: 'https://jackal.rmq.cloudamqp.com/api/queues/uoauoiue/tasks/contents',
    method: 'DELETE',
    body: {
      vhost: 'uoauoiue',
      name: 'tasks',
      mode: 'purge'
    },
    headers: {
      authorization: 'Basic dW9hdW9pdWU6TzdMTThmNW5tckh6a2FLeFI4ejRjSW40akgwUk1iVVU='
    },
    failOnStatusCode: false
  }).then(response => { return response });
});

Cypress.Commands.add('getMessageQueue', () => {
  cy.api({
    url: 'https://jackal.rmq.cloudamqp.com/api/queues/uoauoiue/tasks/get',
    method: 'POST',
    body: {
      vhost: 'uoauoiue',
      name: 'tasks',
      truncate: '50000',
      ackmode: 'ack_requeue_true',
      encoding: 'auto',
      count: '1'
    },
    headers: {
      authorization: 'Basic dW9hdW9pdWU6TzdMTThmNW5tckh6a2FLeFI4ejRjSW40akgwUk1iVVU='
    },
    failOnStatusCode: false
  }).then(response => { return response });
});