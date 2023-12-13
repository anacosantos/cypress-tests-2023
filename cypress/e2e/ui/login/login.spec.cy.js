/// <reference types="Cypress" />

import Login from "../../../page-objects/login";
const login = new Login();
import NavButtons from "../../../page-objects/navButtons";
const navButtons = new NavButtons();
import { getErrorField } from "../../../support/utils";

let signinData;

describe("UI - Sign in a user", () => {
  before(() => {
    cy.clearLocalStorage();
    cy.fixture("authentication/authenticationErrors.json").then((data) => {
      signinData = data;
    });
  });

  beforeEach(() => {
    cy.visit("/");
    cy.title().should("include", "Conduit");
  });

  it("TC003 - Should Sign in", () => {
    cy.login();
    navButtons.getYourFeed().should("have.class", "active");
    navButtons.getGlobalFeedNavButton().should("not.have.class", "active");
    cy.location("pathname").should("equal", "/");
    navButtons.getSettingsNavButton().click();
    navButtons.getLogoutButton().click();
  });

  it("TC004 - Should validate required fields to Sign in", () => {
    //without fill up email
    cy.login(" ", Cypress.env("password"));
    getErrorField()
      .should("be.visible")
      .should("contain.text", signinData.errors.emailCannotBlank);
    cy.url().should("contain", "/login");

    login.getEmailField().clear();
    login.getPasswordField().clear();

    //without fill up password
    cy.login(Cypress.env("email"), " ");
    getErrorField()
      .should("be.visible")
      .should("contain.text", signinData.errors.passwordCannotBlank);
    cy.url().should("contain", "/login");
  });

  it("TC005 - Should log out sucessfully", () => {
    cy.login();
    navButtons.getSettingsNavButton().click();
    navButtons.getLogoutButton().click();
    cy.url().should("contain", "#/");
  });
});
