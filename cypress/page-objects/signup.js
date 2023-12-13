class Signup {
    getYourNameField () {
        return cy.get('input[placeholder="Username"]')
    }

    getEmailField () {
        return cy.get('input[placeholder="Email"]')
    }

    getPasswordField () {
        return cy.get('input[placeholder="Password"]')
    }

    getSignupButton() {
        return cy.get('button.btn.btn-lg.btn-primary.pull-xs-right.ng-binding').contains('Sign up');

    }

    signupFormFields(data){
        this.getYourNameField().should("exist").type(data.yourName);
        this.getEmailField().should("exist").type(data.emailField);
        this.getPasswordField().should("exist").type(data.password);
    }
}

export default Signup;