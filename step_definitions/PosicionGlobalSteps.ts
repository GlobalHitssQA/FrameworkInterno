import bbvaLoginPage from '../pages/bbvaLoginPage'
import posicionGlobalPage from '../pages/posicionGlobalPage'

// ── CP2: F - Posición Global - Generico (Imprimir saldos / Descargar PDF) ──────

Given('I navigate to the BBVA login URL', () => {
	bbvaLoginPage.navigateToLoginUrl()
})

When(
	/^I fill the card number "([^"]*)" in the login form$/,
	async (card: string) => {
		await bbvaLoginPage.enterCardNumber(card)
	}
)

When(
	/^I fill the password "([^"]*)" in the login form$/,
	async (password: string) => {
		await bbvaLoginPage.enterPassword(password)
	}
)

When('I click the login submit button', async () => {
	await bbvaLoginPage.clickLoginButton()
})

When(
	/^I submit the login form with token "([^"]*)"$/,
	async (token: string) => {
		await bbvaLoginPage.submitLoginWithToken(token)
	}
)

When(
	'I click the "Imprimir saldos" link on the global position page',
	async () => {
		await posicionGlobalPage.clickPrintBalancesButton()
	}
)

Then(
	'a PDF file with the global position balance details should be downloaded',
	async () => {
		await posicionGlobalPage.verifyGlobalPositionPdfDownloaded()
	}
)

Then('the global position page should be displayed', async () => {
	await posicionGlobalPage.verifyGlobalPositionIsDisplayed()
})

// ── CP3: F - Posición Global - Generico (Movimientos por período) ─────────────

When('I open the three-dot menu on the peso account card', async () => {
	await posicionGlobalPage.openThreeDotsMenuOnDebitCard()
})

When('I select "Movimientos" from the account card menu', async () => {
	await posicionGlobalPage.clickMovimientosFromCardMenu()
})

When(/^I select the movements period "([^"]*)"$/, async (period: string) => {
	await posicionGlobalPage.selectMovementsPeriod(period)
})

Then('the movements table columns should be visible', async () => {
	await posicionGlobalPage.verifyMovementsTableColumnsVisible()
})

Then('the download options for movements should be available', async () => {
	await posicionGlobalPage.verifyMovementsDownloadOptionsVisible()
})

// ── CP4: F - Posición Global - Generico (Descargar Movimientos PDF/Excel/Imprimir) ──

Then('the movements export options should be available', async () => {
	await posicionGlobalPage.verifyMovementsExportOptionsVisible()
})

// ── CP5: F - Posición Global - Generico (Movimientos TDC por período) ────────

When('I open the three-dot menu on the credit card TDC card', async () => {
	await posicionGlobalPage.openThreeDotsMenuOnCreditCard()
})

When('I select "Movimientos" from the credit card menu', async () => {
	await posicionGlobalPage.clickMovimientosFromCreditCardMenu()
})

When(
	/^I select the TDC movements period "([^"]*)"$/,
	async (period: string) => {
		await posicionGlobalPage.selectTDCMovementsPeriod(period)
	}
)

Then(
	'the TDC movements columns Fecha Descripcion Importe and Saldo should be configured',
	async () => {
		await posicionGlobalPage.verifyTDCMovementsColumnsConfigured()
	}
)

Then(
	'the TDC movements export options PDF Excel and Print should be available',
	async () => {
		await posicionGlobalPage.verifyTDCMovementsExportOptionsConfigured()
	}
)
