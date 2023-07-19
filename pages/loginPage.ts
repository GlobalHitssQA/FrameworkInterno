const { I } = inject()

class LoginPage {
	fields: {
		username: string
		password: string
		buttonText: string
		textInLoginPage: string

	}

	constructor() {
		this.fields = {
			username: 'USER',
			password: 'PASSWORD',
			buttonText: '//*[@id="loginFormSubmit"]',
			textInLoginPage: 'Ingresa a tu cuenta',
		}
	}

	async fillTheFields(username: string, password: string) {
		const amNotILoggedIn = await globalThis.tryTo(() =>
			I.see(this.fields.textInLoginPage)
		)
		if (amNotILoggedIn) {
			I.fillField(this.fields.username, username)
			I.fillField(this.fields.password, password)
			I.click(this.fields.buttonText)
			I.fillField('#MfaCode','111111')
			I.pressKey('Enter')
			I.wait(10)
			I.click('#continueCheckbox')
			I.click('CONTINUAR')
			I.click('SEGUIR')
			
		}
	}
}

export = new LoginPage()
