const { defineConfig } = require("cypress");

const { connect } = require('./cypress/support/mongo');

module.exports = defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3333',
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
