import loginPage from '../pages/loginPage'
import bbvaLoginPage from '../pages/bbvaLoginPage'
import bbvaPosicionGlobalPage from '../pages/bbvaPosicionGlobalPage'

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

// ─── CP1: F - Posición Global - Genérico ────────────────────────────────────

Given('I am on the BBVA login page', () => {
	bbvaLoginPage.navigateToLoginPage()
})

When(
	/^I enter card number "([^"]*)" and password "([^"]*)"$/,
	async (cardNumber: string, password: string) => {
		await bbvaLoginPage.typeCardNumber(cardNumber)
		bbvaLoginPage.typePassword(password)
	}
)

When('I click the login button', () => {
	bbvaLoginPage.clickLoginButton()
})

Then(
	'the global position page should be displayed with the client alias',
	async () => {
		await bbvaPosicionGlobalPage.waitForGlobalPositionAndVerifyAlias()
	}
)

Then(
	'the debit account and credit card sections should be visible',
	async () => {
		await bbvaPosicionGlobalPage.verifyAccountSectionsVisible()
	}
)

// ─── CP2: F - Posición Global - Imprimir saldos / Descargar ─────────────────

When('I click on the "Imprimir saldos" link in global position', async () => {
	await bbvaPosicionGlobalPage.clickImprimirSaldos()
})

Then(
	'a PDF file should be downloaded from the global position page',
	async () => {
		await bbvaPosicionGlobalPage.verifyPdfDownloadCompleted()
	}
)

// ─── CP3: F - Posición Global - Movimientos de cuenta en pesos ───────────────

When(
	'I open movements for the pesos account from the three-dot menu',
	async () => {
		await bbvaPosicionGlobalPage.openMovementsForPesosAccount()
	}
)

When(/^I select the movement period "([^"]*)"$/, async (period: string) => {
	await bbvaPosicionGlobalPage.selectMovementPeriod(period)
})

Then(
	'the movements table columns "FECHA", "DESCRIPCIÓN", "MONTO" and "SALDO TOTAL" should be visible',
	async () => {
		await bbvaPosicionGlobalPage.verifyMovementsTableColumnsVisible()
	}
)

Then(
	'the download options section should be present in the movements page',
	async () => {
		await bbvaPosicionGlobalPage.verifyDownloadOptionsSectionPresent()
	}
)

// ─── CP4: F - Posición Global - Descargar movimientos PDF/Excel/Impresión ────

When(
	/^I download the movements in "([^"]*)" format$/,
	async (format: string) => {
		await bbvaPosicionGlobalPage.downloadMovementsInFormat(format)
	}
)

// ─── CP5: F - Posición Global - TDC Movimientos por período ──────────────────

When('I open movements for the TDC card from the three-dot menu', async () => {
	await bbvaPosicionGlobalPage.openMovementsForTdcCard()
})

When(
	/^I select the TDC credit card movement period "([^"]*)"$/,
	async (period: string) => {
		await bbvaPosicionGlobalPage.selectTdcMovementPeriod(period)
	}
)

Then(
	/^the TDC movements section should be visible with period "([^"]*)" selected$/,
	async (period: string) => {
		await bbvaPosicionGlobalPage.verifyTdcMovementsComponentVisible(period)
	}
)

Then(
	'the TDC movements download options components should be present',
	async () => {
		await bbvaPosicionGlobalPage.verifyTdcDownloadOptionsPresent()
	}
)
