const { defineConfig } = require("cypress");

module.exports = defineConfig({
  projectId: "8nry2r",
  viewportHeight: 1000,
  viewportWidth: 1280,
  defaultCommandTimeout: 11000,
  pageLoadTimeout: 10000,
  numTestsKeptInMemory: 3,
  experimentalMemoryManagement: true,
  retries: {
    runMode: 2,
    openMode: 0,
  },
  env: {
    api_url: 'https://api.realworld.io/api',
    name: "Cypress tests",
    email: 'cypress-tests@gmail.com',
    password: '12345678',
    silenceCommandLog: false,
  },
  video: false,
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    baseUrl: 'https://demo.realworld.io/#/',
    testIsolation: false,
    chromeWebSecurity: false,
  },
});
