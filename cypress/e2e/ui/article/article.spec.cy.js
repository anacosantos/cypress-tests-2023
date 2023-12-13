/// <reference types="Cypress" />
import Article from "../../../page-objects/article";
const article = new Article();
import NavButtons from "../../../page-objects/navButtons";
const navButtons = new NavButtons();
import fakerator from "fakerator";

import { getErrorField, generateRandomTitle } from "../../../support/utils";

let signupData;
describe("UI - Article", () => {
  context("Create article", () => {
    before(() => {
      cy.login();
      cy.fixture("authentication/authenticationErrors.json").then((data) => {
        signupData = data;
      });
    });

    beforeEach(() => {
      article.getNewArticleNavBtn().click();
    });

    after(() => {
      navButtons.getSettingsNavButton().click();
      navButtons.getLogoutButton().click();
    });

    it("TC006 - Should create an article", () => {
      cy.fixture("article/article.json").then((myArticle) => {
        //creating random title. App doesn't accept the same title
        myArticle.article.title = generateRandomTitle();
        article.writeArticleForm(myArticle.article);
        article.pusblishArticleButton().click();
        cy.url().should("contain", "/article/Cy-Article");
        article
          .getPublishedArticleTitle()
          .should("contain", myArticle.article.title);
        article
          .getPublishedArticleContent()
          .should("contain", myArticle.article.body);
        article.getPublishedTag().should("contain", myArticle.article.tagList);
      });
    });

    it("TC007 - Should not create an article", () => {
      //article required
      article.getWriteYourArticleField().type(fakerator().internet.userName());
      article.pusblishArticleButton().click();
      getErrorField()
        .should("be.visible")
        .should("contain.text", signupData.errors.titleannotBlank);

      article.getWriteYourArticleField().clear();

      //description required
      article.getNewArticleTitle().type(generateRandomTitle());
      article.pusblishArticleButton().click();
      getErrorField()
        .should("be.visible")
        .should("contain.text", signupData.errors.descriptionCannotBlank);

      article.getNewArticleTitle().clear();

      //title required
      article.getWhatIsArticleAboutField().type(generateRandomTitle());
      article.pusblishArticleButton().click();
      getErrorField()
        .should("be.visible")
        .should("contain.text", signupData.errors.titleannotBlank);

      article.getWhatIsArticleAboutField().clear();

      //body required
      article.getNewArticleTitle().type(generateRandomTitle());
      article.getWhatIsArticleAboutField().type(generateRandomTitle());
      article.pusblishArticleButton().click();
      getErrorField()
        .should("be.visible")
        .should("contain.text", signupData.errors.bodyCannotBlank);
    });
  });

  context("Edit article", () => {
    before(() => {
      cy.login();
    });

    beforeEach(() => {
      article.getNewArticleNavBtn().click();
    });

    it("TC008 - Edit an article", () => {
      cy.fixture("article/article.json").then((myArticle) => {
        //creating random title. App doesn't accept the same title
        myArticle.article.title = generateRandomTitle();

        article.writeArticleForm(myArticle.article);
        article.pusblishArticleButton().click();
        cy.url().should("contain", "/article/Cy-Article");

        article
          .getPublishedArticleTitle()
          .should("contain", myArticle.article.title);
        article
          .getPublishedArticleContent()
          .should("contain", myArticle.article.body);
        article.getPublishedTag().should("contain", myArticle.article.tagList);

        //edit article - title
        article.editArticleButton();
        article.getNewArticleTitle().should("exist").focus().clear();
        article.getNewArticleTitle().should("be.empty");
        article
          .getNewArticleTitle()
          .type("New-Edited-Articles" + myArticle.article.title);
        article.pusblishArticleButton().click();
        article
          .getPublishedArticleTitle()
          .should("contain", "New-Edited-Articles");

        //edit body
        article.editArticleButton();
        article.getWriteYourArticleField().should("exist").focus().clear();
        article
          .getWriteYourArticleField()
          .type("Edited-description" + myArticle.article.title);
        article.pusblishArticleButton().click();
        article
          .getPublishedArticleContent()
          .should("contain", "Edited-description");
      });
    });

    it("TC009 - Delete an article", () => {
      cy.fixture("article/article.json").then((myArticle) => {
        //creating random title. App doesn't accept the same title
        myArticle.article.title = "Delete-article" + generateRandomTitle();
        article.writeArticleForm(myArticle.article);
        article.pusblishArticleButton().click();
        cy.url().should("contain", "/article/Delete-article");
        article
          .getPublishedArticleTitle()
          .should("contain", myArticle.article.title);
        article
          .getPublishedArticleContent()
          .should("contain", myArticle.article.body);
        article.getPublishedTag().should("contain", myArticle.article.tagList);

        //delete
        navButtons.getHomeNavBtn().click();
        navButtons.getGlobalFeedNavButton().click();
        cy.contains("Delete-article").click();
        article.deleteArticleButton();
        navButtons.getHomeNavBtn().click();
        navButtons.getGlobalFeedNavButton().click();
        cy.contains("h1.ng-binding", "Deleted-article").should("not.exist");
      });
    });

    it("TC010 - Should to favorite an article", () => {
      cy.fixture("article/article.json").then((myArticle) => {
        myArticle.article.title = generateRandomTitle();
        article.writeArticleForm(myArticle.article);
        article.pusblishArticleButton().click();
        cy.url().should("contain", "/article/Cy-Article");

        article.getPublishedArticleTitle(myArticle.article.title);
        navButtons.getHomeNavBtn().click();
        navButtons.getGlobalFeedNavButton().click();
        article.getFavoriteButton().click();
        navButtons.getMyProfile().click();
        article.getFavoritedArticleButton().click();
        article.getFavoritedButton().should("exist");
      });
    });
  });
});
