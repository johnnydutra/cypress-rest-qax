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