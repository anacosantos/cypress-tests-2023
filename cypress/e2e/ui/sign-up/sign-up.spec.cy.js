/// <reference types="cypress"/>
import fakerator from "fakerator";
import Signup from "../../../page-objects/signup";
const signup = new Signup();
import NavButtons from "../../../page-objects/navButtons";
const navButtons = new NavButtons();
import { getErrorField } from "../../../support/utils";

let signupData;

describe("UI -Sign up a user", () => {
  before(() => {
    cy.clearLocalStorage();
    cy.fixture("authentication/authenticationErrors.json").then((data) => {
      signupData = data;
    });
    cy.visit("/");
    cy.title().should("include", "Conduit");
  });

  beforeEach(() => {
    cy.clearLocalStorage();
    cy.visit("/register");
    cy.title().should("include", "Sign up");
  });

  it("TC001 - Should Sign up", () => {
    const yourName = fakerator().internet.userName();
    const form = {
      yourName: yourName,
      emailField: yourName + "@gmail.com",
      password: fakerator().internet.password(),
    };
    signup.signupFormFields(form);
    signup.getSignupButton().click();
    navButtons.getSettingsNavButton().click();
    navButtons.getLogoutButton().click();
    cy.url().should("contain", "#/");
  });

  it("TC002 - Should validate required fields to Sign up", () => {
    //email required passing all fields in blank
    signup.getSignupButton().click();
    getErrorField()
      .should("be.visible")
      .should("contain.text", signupData.errors.emailCannotBlank);

    cy.reload();
    signup.getEmailField().type(fakerator().internet.email());
    signup.getSignupButton().click();
    getErrorField()
      .should("be.visible")
      .should("not.contain.text", signupData.errors.emailCannotBlank);
    getErrorField()
      .should("be.visible")
      .should("contain.text", signupData.errors.usernameCannotBlank);

    //username required
    cy.reload();
    signup.getYourNameField().clear().type(fakerator().internet.userName());
    signup.getSignupButton().click();
    getErrorField().should(
      "not.contain.text",
      signupData.errors.usernameCannotBlank,
    );

    //password required
    cy.reload();
    signup.getYourNameField().type(fakerator().internet.userName());
    signup.getEmailField().type(fakerator().internet.email());
    signup.getSignupButton().click();
    getErrorField()
      .should("be.visible")
      .should("contain.text", signupData.errors.passwordCannotBlank);
  });
});
