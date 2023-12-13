/// <reference types="cypress"/>
import fakerator from "fakerator";
const apiUrlSignin = Cypress.env("api_url") + "/users";

let defaultBody = {
  method: "POST",
  url: apiUrlSignin,
  headers: { "content-type": "application/json" },
  failOnStatusCode: false,
};

const body = {
  user: {
    username: fakerator().internet.userName(),
    email: fakerator().internet.userName() + "@gmail.com",
    password: fakerator().internet.password(),
  },
};

describe("REST API - Sign up a user", () => {
  beforeEach(() => {
    defaultBody.body = JSON.parse(JSON.stringify(body));
  });

  it("TC011 - Should Sign up", () => {
    cy.request(defaultBody).then((response) => {
      expect(response.body.user.email).to.exist;
      expect(response.body.user.username).to.exist;
      expect(response.body.user.bio).equal(null);
      expect(response.body.user.token).to.exist;
      expect(response.isOkStatusCode).true;
    });
  });

  it("TC012: Should validate required fields to Sign up", () => {
    //email
    delete defaultBody.body.user.email;
    cy.request(defaultBody)
      .then((response) => {
        expect(response.body.errors.email[0]).equal("can't be blank");
        expect(response.isOkStatusCode).false;
      })
      .then(() => {
        //username
        defaultBody.body = JSON.parse(JSON.stringify(body));
        delete defaultBody.body.user.username;
        cy.request(defaultBody).then((response) => {
          expect(response.body.errors.username[0]).equal("can't be blank");
          expect(response.isOkStatusCode).false;
        });
        //password
      })
      .then(() => {
        defaultBody.body = JSON.parse(JSON.stringify(body));
        delete defaultBody.body.user.password;
        cy.request(defaultBody).then((response) => {
          expect(response.body.errors.password[0]).equal("can't be blank");
          expect(response.isOkStatusCode).false;
        });
      });
  });
});
