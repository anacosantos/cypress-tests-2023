class Login {
    getEmailField () {
        return cy.get('input[placeholder="Email"]')
    }

    getPasswordField () {
        return cy.get('input[placeholder="Password"]')
    }

    signinNavBtn () {
        return cy.get('a[href="#/login"]').first().click({force:true});
    }

    signinButton() {
        return cy.contains('button', 'Sign in')
    }

    fillUpSigninForm() {
        const fakeratorInstance = fakerator();
        this.getYourNameField().should("exist").type(fakeratorInstance.internet.userName());
        this.getEmailField().should("exist").type(fakeratorInstance.internet.userName()+"@gmail.com");
        this.getPasswordField().should("exist").type(fakeratorInstance.internet.password());
    }
    
    signinFormFields(data){
        this.getYourNameField().should("exist").type(data.yourName);
        this.getEmailField().should("exist").type(data.emailField);
        this.getPasswordField().should("exist").type(data.password);
    }
}

export default Login;