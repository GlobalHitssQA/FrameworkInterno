const { I } = inject()

class BbvaLoginPage {
	// Inspeccionado via MCP Playwright en https://test.bbvanet.com.mx/andrea/mxdydni/login — atributo id
	private loginUrl: string

	private cardNumberField: string

	private passwordField: string

	private loginButton: string

	// Inspeccionado via MCP Playwright en https://test.bbvanet.com.mx/andrea/mxdydni/login?execution=e2s1 — atributo id
	private tokenField: string

	// Inspeccionado via MCP Playwright — button role selector (página token)
	private tokenContinuarButton: string

	constructor() {
		this.loginUrl = 'https://test.bbvanet.com.mx/andrea/mxdydni/login'
		// id="username2", type="text" — Campo Número de tarjeta (visible, sincroniza al campo hidden #username)
		this.cardNumberField = '#username2'
		// id="password", type="password" — Campo Contraseña
		this.passwordField = '#password'
		// id="btnAcceso", class="btn_acceso", type="submit" — Botón Continuar
		this.loginButton = '#btnAcceso'
		// id="tkn" — Campo Token móvil en la segunda pantalla de autenticación
		this.tokenField = '#tkn'
		// button type="submit" con texto "Continuar" en la página del token
		this.tokenContinuarButton = 'button:has-text("Continuar")'
	}

	async navigateToLoginPage() {
		I.amOnPage(this.loginUrl)
	}

	async fillCardNumber(cardNumber: string) {
		I.fillField(this.cardNumberField, cardNumber)
	}

	async fillPassword(password: string) {
		I.fillField(this.passwordField, password)
	}

	async fillLoginForm(cardNumber: string, password: string) {
		await this.fillCardNumber(cardNumber)
		await this.fillPassword(password)
	}

	async clickContinuar() {
		I.click(this.loginButton)
	}

	async fillToken(token: string) {
		I.fillField(this.tokenField, token)
	}

	async clickContinuarAfterToken() {
		I.click(this.tokenContinuarButton)
	}
}

export = new BbvaLoginPage()
