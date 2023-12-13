class Article {
    getNewArticleNavBtn() {
        return cy.get('a.nav-link[href="#/editor/"]').should("exist")
    }

    getNewArticleTitle() {
        return cy.get('input[placeholder="Article Title"]')
    }

    getWhatIsArticleAboutField() {
        return cy.get('input[placeholder="What\'s this article about?"]');
    }

    getWriteYourArticleField() {
        return cy.get('textarea[placeholder="Write your article (in markdown)"]');
    }

    getTagsField() {
        return cy.get('input[type="text"][placeholder="Enter tags"]')
    }
      
    writeArticleForm(data) {
        this.getNewArticleTitle().should("be.visible").type(data.title)
        this.getWhatIsArticleAboutField().should("be.visible").type(data.description)
        this.getWriteYourArticleField().should("be.visible").type(data.body)
        this.getTagsField().should("be.visible").type(data.tagList+"{enter}")
    }

    pusblishArticleButton() {
        return cy.contains('button', 'Publish Article')
    }

    getPublishedArticleTitle () {
        return cy.get('h1[ng-bind="::$ctrl.article.title"]')
    }

    getPublishedArticleContent() {
        return cy.get('.ng-binding > p').should('exist')
    }

    getPublishedTag(){
        return cy.get('.tag-default')
    }

    editArticleButton(){
        //the best way is use data-cy
        return cy.contains('Edit Article').click()
    }

    deleteArticleButton() {
        //the best way is use data-cy
        return cy.contains('Delete Article').click()
    }

    getFavoritedArticleButton() {
        return cy.contains('a.nav-link', 'Favorited Articles')
    }

    getFavoriteButton() {
        return cy.get("button.btn.btn-sm.btn-outline-primary").first()
    }

    getFavoritedButton() {
        return cy.get("button.btn.btn-sm.btn-primary")
    }
}

export default Article;