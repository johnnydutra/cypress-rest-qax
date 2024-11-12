const { defineConfig } = require("cypress");
const { connect } = require('./cypress/support/mongo');

require('dotenv').config();

module.exports = defineConfig({
  e2e: {
    baseUrl: process.env.BASE_URL,
    env: {
      amqpHost: process.env.AMQP_HOST,
      amqpQueue: process.env.AMQP_QUEUE,
      amqpToken: process.env.AMQP_TOKEN
    },
    async setupNodeEvents(on, config) {
      const db = await connect();
      on('task', {
        async removeUser(email) {
          const users = db.collection('users');
          await users.deleteMany({ email: email });
          return null;
        },
        async removeTask(userEmail, taskName) {
          const users = db.collection('users');
          const user = users.findOne({ email: userEmail });
          const tasks = db.collection('tasks');
          await tasks.deleteMany({ task: taskName, user: user._id });
          return null;
        },
        async removeTasksLike(key) {
          const tasks = db.collection('tasks');
          await tasks.deleteMany({ name: { $regex: key } });
          return null;
        }
      })
    },
  },
});
