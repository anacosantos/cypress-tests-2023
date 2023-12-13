export function getErrorField () {
    return cy.get('.error-messages')
}

export function createHeaderWithToken(token) {
    return {
      'content-type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
  }

export function globalFeedNavButton() {
    return cy.get('a.nav-link').contains('Global Feed').click()
}

export function myProfile() {
    return cy.contains('a.nav-link.ng-binding', 'Cypress tests')
    
}

export function generateRandomTitle() {
    const randomNumber = Math.floor(Math.random() * 1000000000);
    const randomTitle = `Cy-Article ${randomNumber}`;
    return randomTitle;
}