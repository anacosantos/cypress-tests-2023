/// <reference types="Cypress" />

const urlLogin = Cypress.env("api_url") + "/users/login";
let errorField;
let userLogin;

let defaultBody = {
  method: "POST",
  url: urlLogin,
  headers: { "content-type": "application/json" },
  failOnStatusCode: false,
};

describe("REST API - Login a user", () => {
  before(() => {
    cy.fixture("authentication/authenticationErrors.json").then((data) => {
      errorField = data;
    });
  });

  beforeEach(() => {
    userLogin = {
      user: {
        email: Cypress.env("email"),
        password: Cypress.env("password"),
      },
    };
    defaultBody.body = JSON.parse(JSON.stringify(userLogin));
  });

  it("TC013: Should Sign in", () => {
    cy.request(defaultBody).then((response) => {
      expect(response.isOkStatusCode).true;
      expect(response.body.user.email).equal(Cypress.env("email"));
      expect(response.body.user.image).to.exist;
      expect(response.body.user.bio).equal(null);
      expect(response.body.user.token).to.exist;
    });
  });

  it("TC014 - Should validate required fields to Sign in", () => {
    //without email
    delete defaultBody.body.user.email;
    cy.request(defaultBody)
      .then((response) => {
        expect(response.body.errors.email[0]).equal(
          errorField.errors.cannotBeBlank,
        );
        expect(response.isOkStatusCode).false;
      })
      .then(() => {
        //without password
        defaultBody.body = JSON.parse(JSON.stringify(userLogin));
        delete defaultBody.body.user.password;
        cy.request(defaultBody).then((response) => {
          expect(response.body.errors.password[0]).equal(
            errorField.errors.cannotBeBlank,
          );
          expect(response.isOkStatusCode).false;
        });
      })
      .then(() => {
        defaultBody.body = JSON.parse(JSON.stringify(userLogin));
        delete defaultBody.body.user.password;
        delete defaultBody.body.user.email;
        cy.request(defaultBody).then((response) => {
          expect(response.body.errors.email[0]).equal(
            errorField.errors.cannotBeBlank,
          );
          expect(response.isOkStatusCode).false;
        });
      });
  });
});
