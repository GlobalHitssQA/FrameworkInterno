const { I } = inject()

class HomePageML {
	fields: {
		username: string
		password: string
		buttonText: string
		checkBox: string
	}

	constructor() {
		this.fields = {
			username: '//input[contains(@name,"userName")]',
			password: '//input[contains(@name,"password")]',
			buttonText:
				'//button[contains(@class,"primary-button button-text")]',
			checkBox: '#checkbox',
		}
	}

	logIn(username: string, password: string) {
		I.amOnPage('')
		I.fillField(this.fields.username, username)
		I.fillField(this.fields.password, password)
		I.click(this.fields.checkBox)
		I.click(this.fields.buttonText)
	}
}

export = new HomePageML()
