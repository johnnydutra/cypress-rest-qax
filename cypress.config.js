const { defineConfig } = require("cypress");

const { connect } = require('./cypress/support/mongo');

module.exports = defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3333',
    async setupNodeEvents(on, config) {
      const db = await connect();
      on('task', {
        async deleteUser(email) {
          const users = db.collection('users');
          await users.deleteMany({email: email});
          return null
        }
      })
    },
  },
});
