/// <reference types="cypress"/>

import {
  createHeaderWithToken,
  generateRandomTitle,
} from "../../../support/utils";

const urlArticle = Cypress.env("api_url") + "/articles";
let tokenGenerated;
let errorField;
let defaultBody = {
  method: "POST",
  url: urlArticle,
  failOnStatusCode: false,
};

let requestBody = {
  article: {
    title: generateRandomTitle(),
    description: "my article is about my test",
    body: "I'm doing a qa tests",
    tagList: [],
  },
};

describe("REST API - Article", () => {
  before(() => {
    cy.fixture("authentication/authenticationErrors.json").then((data) => {
      errorField = data;
    });
  });

  beforeEach("Login to the app", () => {
    cy.assignCustomToken(Cypress.env("email"), Cypress.env("password"));
    cy.get("@token").then((token) => {
      tokenGenerated = token;
    });
  });

  it("TC015 - Should create an article", () => {
    defaultBody.headers = createHeaderWithToken(tokenGenerated);
    defaultBody.body = JSON.parse(JSON.stringify(requestBody));
    cy.request(defaultBody).then((response) => {
      expect(response.statusText).equal("Created");
      expect(response.isOkStatusCode).true;
      expect(response.body.article.author.username).equal("Cypress tests");
      expect(response.body.article.body).equal(requestBody.article.body);
      expect(response.body.article.title).to.match(/Cy-Article/);
      expect(response.body.article.createdAt).not.be.empty;
    });
  });

  it("TC016 - Should validate required fields create an article", () => {
    //without title
    defaultBody.headers = createHeaderWithToken(tokenGenerated);
    defaultBody.body = JSON.parse(JSON.stringify(requestBody));
    defaultBody.body.article.title = "";
    cy.request(defaultBody).then((response) => {
      expect(response.isOkStatusCode).to.be.false;
      expect(response.body.errors.body[0]).to.equal(
        errorField.errors.cannotBeBlank,
      );
    });

    //without description
    defaultBody.headers = createHeaderWithToken(tokenGenerated);
    defaultBody.body = JSON.parse(JSON.stringify(requestBody));
    defaultBody.body.article.description = "";
    cy.request(defaultBody).then((response) => {
      expect(response.isOkStatusCode).to.be.false;
      expect(response.body.errors.body[0]).to.equal(
        errorField.errors.cannotBeBlank,
      );
    });

    //without description
    defaultBody.headers = createHeaderWithToken(tokenGenerated);
    defaultBody.body = JSON.parse(JSON.stringify(requestBody));
    defaultBody.body.article.body = "";
    cy.request(defaultBody).then((response) => {
      expect(response.isOkStatusCode).to.be.false;
      expect(response.body.errors.body[0]).to.equal(
        errorField.errors.cannotBeBlank,
      );
    });
  });

  it("TC017 - Should delete an article", () => {
    defaultBody.headers = createHeaderWithToken(tokenGenerated);
    defaultBody.body = JSON.parse(JSON.stringify(requestBody));
    defaultBody.body.article.title = "Deleted article" + generateRandomTitle();
    cy.request(defaultBody).then((response) => {
      expect(response.statusText).equal("Created");
      expect(response.isOkStatusCode).to.be.true;
      expect(response.body.article.author.username).to.equal("Cypress tests");
      expect(response.body.article.body).equal(requestBody.article.body);
      expect(response.body.article.title).to.match(/Deleted article/);
      expect(response.body.article.createdAt).to.not.be.empty;
      const articleUrl = urlArticle + "/" + response.body.article.slug;
      cy.request({
        method: "DELETE",
        url: articleUrl,
        headers: defaultBody.headers,
      }).then((response) => {
        expect(response.isOkStatusCode).to.be.true;
      });
    });
  });

  it("TC018 - Should edit an article", () => {
    defaultBody.headers = createHeaderWithToken(tokenGenerated);
    defaultBody.body = JSON.parse(JSON.stringify(requestBody));
    defaultBody.body.article.title = "Edit article" + generateRandomTitle();
    cy.request(defaultBody).then((response) => {
      expect(response.statusText).equal("Created");
      expect(response.isOkStatusCode).to.be.true;
      expect(response.body.article.author.username).to.equal("Cypress tests");
      expect(response.body.article.body).equal(requestBody.article.body);
      expect(response.body.article.title).to.match(/Edit article/);
      expect(response.body.article.createdAt).to.not.be.empty;
      defaultBody.headers = createHeaderWithToken(tokenGenerated);

      const articleUrlEdit = urlArticle + "/" + response.body.article.slug;
      cy.request({
        method: "PUT",
        url: articleUrlEdit,
        headers: defaultBody.headers,
        body: {
          article: {
            title: "Edited article" + generateRandomTitle(),
            description: "my article is about my test",
            body: "I'm doing a qa tests",
            tagList: [],
            favorited: false,
            favoritesCount: 0,
            author: {
              username: "Cypress tests",
              bio: null,
              image: "https://api.realworld.io/images/smiley-cyrus.jpeg",
              following: false,
            },
          },
        },
      }).then((response) => {
        expect(response.statusText).equal("OK");
        expect(response.isOkStatusCode).to.be.true;
        expect(response.body.article.author.username).to.equal("Cypress tests");
        expect(response.body.article.body).to.equal(requestBody.article.body);
        expect(response.body.article.title).to.match(/Edited article/);
      });
    });
  });
});
