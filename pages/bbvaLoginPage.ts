const { I } = inject()

class BbvaLoginPage {
	// Inspeccionado via MCP Playwright en https://test.bbvanet.com.mx/andrea/mxdydni/login — atributo id
	// Campo visible del número de tarjeta (username2 es el campo editable; username es un hidden)
	private readonly cardNumberField = '#username2'

	// Inspeccionado via MCP Playwright en https://test.bbvanet.com.mx/andrea/mxdydni/login — atributo id
	private readonly passwordField = '#password'

	// Inspeccionado via MCP Playwright en https://test.bbvanet.com.mx/andrea/mxdydni/login — atributo id
	private readonly submitButton = '#btnAcceso'

	navigateToLoginPage() {
		I.amOnPage('https://test.bbvanet.com.mx/andrea/mxdydni/login')
	}

	async typeCardNumber(cardNumber: string) {
		// I.fillField usa page.fill() que establece el valor directamente sin disparar eventos de teclado.
		// El campo #username2 tiene validación JavaScript que requiere keydown/keypress/keyup
		// para aceptar la entrada. pressSequentially activa dichos eventos y permite el submit correcto.
		await I.usePlaywrightTo(
			'type card number triggering keyboard events',
			async ({ page }) => {
				await page.locator('#username2').click()
				await page.locator('#username2').pressSequentially(cardNumber)
			}
		)
	}

	typePassword(password: string) {
		I.fillField(this.passwordField, password)
	}

	clickLoginButton() {
		I.click(this.submitButton)
	}
}

export = new BbvaLoginPage()
