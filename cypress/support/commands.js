/// <reference types="cypress" />
  
Cypress.Commands.add('login', (email=Cypress.env('email'), password=Cypress.env('password')) => {
  cy.clearLocalStorage();
  cy.visit("/");
  cy.get('a[href="#/login"]').should('exist').click()
  cy.get('input[placeholder="Email"]').type(email)
  cy.get('input[placeholder="Password"]').type(password)
  cy.get('button.btn.btn-lg.btn-primary.pull-xs-right.ng-binding')
  .contains('Sign in').click();
  //cy.get('a[href="#/login"]').should('exist').click()
});

Cypress.Commands.add('assignCustomToken', (customEmail, customPassword) => {
  const authetications = {
    user: {
      email: customEmail,
      password: customPassword
    }
  };
  cy.request({
    method: 'POST',
    url: Cypress.env('api_url') + '/users/login',
    body: authetications,
    failOnStatusCode: false,
    headers: { 'content-type': 'application/json' },
  }).its('body')
    .then((body) => {
      cy.wrap(body.user.token).as('token');
    });
});


