const { I } = inject()

class LoginPage {
	fields: {
		username: string
		password: string
		button: string
		campoCodVal: string
		codigoVal: string
		idCheckBox: string
		enter: string
		continuarButton: string
		seguirButton: string
		textInLoginPage: string

	}

	constructor() {
		this.fields = {
			username: 'USER',
			password: 'PASSWORD',
			button: 'INGRESAR',
			campoCodVal: '#MfaCode',
			codigoVal:'111111',
			idCheckBox: '#continueCheckbox',
			enter: 'Enter',
			continuarButton: 'CONTINUAR',
			seguirButton: 'SEGUIR',
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
			I.click(this.fields.button)
			I.fillField(this.fields.campoCodVal,this.fields.codigoVal)
			I.pressKey(this.fields.enter)
			I.wait(10)
			I.click(this.fields.idCheckBox)
			I.click(this.fields.continuarButton)
			I.click(this.fields.seguirButton)
			
		}
	}
}

export = new LoginPage()
