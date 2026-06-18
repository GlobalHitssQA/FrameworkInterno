import loginPage from '../pages/loginPage'
import bbvaLoginPage from '../pages/bbvaLoginPage'
import posicionGlobalPage from '../pages/posicionGlobalPage'

const { I, login } = inject()

Given('Im logged in', async () => {
	I.wait(10)
})
// ejemplo de step para hacer uso del autologin
Given(/^Im logged in as "([^"]*)"$/, async (profile: profileType) => {
	await login(profile)
})
// ejemplo descarga PDF
Given(/^I download pdf$/, async () => {
	await loginPage.downloadPDF()
})
// ejemplo validacion contenido PDF
Given(/^I validate pdf$/, async () => {
	await loginPage.validatePDF()
})

Given(/^I select the contact$/, () => {
	I.wait(0)
})
When(
	/^I should create the appointment with (.*) , (.*) , (.*) , (.*) , (.*) , (.*)$/,
	(name, surname, phone, email, date, time) => {
		// eslint-disable-next-line no-console
		console.log(name, surname, phone, email, date, time)
		I.wait(0)
	}
)

// ── CP1: F - Posición Global - Generico ────────────────────────────────────────
Given(/^I navigate to the BBVA Mexico login page$/, async () => {
	await bbvaLoginPage.navigateToLoginPage()
})

When(
	/^I enter card number "([^"]*)" and password "([^"]*)"$/,
	async (cardNumber: string, password: string) => {
		await bbvaLoginPage.fillLoginForm(cardNumber, password)
	}
)

When(/^I click the Continuar button$/, async () => {
	await bbvaLoginPage.clickContinuar()
})

Then(/^the global position page should be displayed$/, async () => {
	await posicionGlobalPage.verifyGlobalPositionIsDisplayed()
})

Then(
	/^the accounts section should show "([^"]*)"$/,
	async (accountName: string) => {
		await posicionGlobalPage.verifyAccountSectionContains(accountName)
	}
)

// ── CP2: F - Posición Global - Generico (Imprimir saldos / Descargar PDF) ──────
When(/^I enter the token "([^"]*)"$/, async (token: string) => {
	await bbvaLoginPage.fillToken(token)
})

When(/^I click the Continuar button after token$/, async () => {
	await bbvaLoginPage.clickContinuarAfterToken()
})

When(/^I click the Imprimir saldos link$/, async () => {
	await posicionGlobalPage.clickImprimirSaldos()
})

Then(/^the PDF file should be downloaded successfully$/, async () => {
	await posicionGlobalPage.verifyPDFDownloaded()
})

// ── CP3: F - Posición Global - Generico (Movimientos por período) ────────────
When(/^I click the three dots on the peso account card$/, async () => {
	await posicionGlobalPage.clickThreeDotsPesoAccount()
})

When(/^I click the Movimientos option$/, async () => {
	await posicionGlobalPage.clickMovimientosOption()
})

When(/^I select the movements period "([^"]*)"$/, async (period: string) => {
	await posicionGlobalPage.selectMovimientosPeriodo(period)
})

Then(
	/^the movements columns Fecha Descripcion Importe and Saldo should be visible$/,
	async () => {
		await posicionGlobalPage.verifyMovimientosColumnsDisplayed()
	}
)

Then(
	/^the movements download options PDF Excel and Impresion should be available$/,
	async () => {
		await posicionGlobalPage.verifyDownloadOptionsDisplayed()
	}
)

// ── CP4: Descargar Movimientos en PDF, Excel e Impresión ──────────────────────
When(
	/^I download the movements report in "([^"]*)" format$/,
	async (format: string) => {
		await posicionGlobalPage.clickMovimientosDownload(format)
	}
)

Then(
	/^the movements report download should be initiated successfully$/,
	async () => {
		await posicionGlobalPage.verifyMovimientosDownloadInitiated()
	}
)

// ── CP5: Movimientos de TDC por período ───────────────────────────────────────
When(/^I click the three dots on the TDC account card$/, async () => {
	await posicionGlobalPage.clickThreeDotsOnTDCCard()
})
