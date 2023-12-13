class NavButtons {

    getSettingsNavButton() {
        return cy.get('a[href="#/settings"]').should('exist')
    }

    getGlobalFeedNavButton() {
        return cy.get('a.nav-link').contains('Global Feed')
    }

    getYourFeed() {
        return cy.contains('a.nav-link', 'Your Feed')
    }

    getMyProfile() {
        return cy.contains('a.nav-link.ng-binding', 'Cypress tests')
    }

    getHomeNavBtn() {
        return cy.get('a.navbar-brand.ng-binding[href="#/"]').should('exist')
    }

    getLogoutButton() {
        return cy.get('.btn-outline-danger').should('exist')
    }

    getSigninNavBtn () {
        return cy.get('a.navbar-brand.ng-binding[href="#/login"]').should('exist')
    }
}

export default NavButtons;