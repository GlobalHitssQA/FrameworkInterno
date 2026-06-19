import loginPage from '../pages/loginPage'
import bbvaLoginPage from '../pages/bbvaLoginPage'
import bbvaMovimientosPage from '../pages/bbvaMovimientosPage'

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

// CP1 — F - Posición Global - Generico
Given(
	/^I login to BBVA with card "([^"]*)" and password "([^"]*)"$/,
	async (card: string, password: string) => {
		await bbvaLoginPage.loginWithTddAndPassword(card, password)
	}
)

Then(/^the global position page should be displayed$/, async () => {
	await bbvaLoginPage.verifyGlobalPositionLoaded()
})

Then(/^the client alias should be visible$/, async () => {
	await bbvaLoginPage.verifyClientAliasVisible()
})

Then(
	/^the account types cuenta en pesos and tarjeta de credito should be visible$/,
	async () => {
		await bbvaLoginPage.verifyAccountTypesVisible()
	}
)

// CP2 — F - Posición Global - Generico: Imprimir saldos / Descargar
When(
	/^I click the Imprimir saldos link to download the balance PDF$/,
	async () => {
		await bbvaLoginPage.clickImprimirSaldosAndDownload()
	}
)

Then(/^the balance PDF file should be downloaded successfully$/, async () => {
	await bbvaLoginPage.verifyBalancePdfDownloaded()
})

// CP3 — F - Posición Global - Generico: Movimientos por período (Mes Actual / Mes Anterior / Dos meses atrás)
When(/^I open the movements section for the peso account$/, async () => {
	await bbvaMovimientosPage.openPesoAccountMovements()
})

When(/^I select the movements period "([^"]*)"$/, async (period: string) => {
	await bbvaMovimientosPage.selectMovementsPeriod(period)
})

Then(
	/^the movements period filter should display "([^"]*)"$/,
	async (period: string) => {
		await bbvaMovimientosPage.verifyPeriodFilterLabel(period)
	}
)

Then(
	/^the movements table should show columns FECHA DESCRIPCION MONTO and SALDO TOTAL$/,
	async () => {
		await bbvaMovimientosPage.verifyMovementsTableHeaders()
	}
)

Then(
	/^the PDF Excel and print export options should be available$/,
	async () => {
		await bbvaMovimientosPage.verifyExportOptionsAvailable()
	}
)

// CP5 — F - Posición Global - Generico: Movimientos TDC hasta 5 meses atrás
When(/^I open the movements section for the TDC account$/, async () => {
	await bbvaMovimientosPage.openTdcAccountMovements()
})

// CP4 — F - Posición Global - Generico: Descargar movimientos en PDF, Excel e Impresión
When(/^I download the movements as PDF$/, async () => {
	await bbvaMovimientosPage.downloadMovementsAsPdf()
})

When(/^I download the movements as Excel$/, async () => {
	await bbvaMovimientosPage.downloadMovementsAsExcel()
})

When(/^I print the movements$/, async () => {
	await bbvaMovimientosPage.printMovements()
})

Then(/^the movements PDF file should be downloaded successfully$/, async () => {
	await bbvaMovimientosPage.verifyMovementsPdfDownloaded()
})

Then(
	/^the movements Excel file should be downloaded successfully$/,
	async () => {
		await bbvaMovimientosPage.verifyMovementsExcelDownloaded()
	}
)
