import path from 'path'

const { I } = inject()

class BbvaLoginPage {
	fields: {
		loginUrl: string
		posicionGlobalUrl: string
		loginFormHeading: string
		cardInput: string
		passwordInput: string
		continueButton: string
		globalPositionContainer: string
		clientNameContainer: string
		tdcIframe: string
		accountCardSelector: string
		greetingSelector: string
		// CP2 — Imprimir saldos / Descargar
		imprimirSaldosButton: string
		balancePdfDownloadPath: string
	}

	constructor() {
		this.fields = {
			// Inspeccionado via MCP Playwright en https://test.bbvanet.com.mx/andrea/mxdydni/login
			// accessible name labels (aria-label / aria-labelledby)
			loginUrl: 'https://test.bbvanet.com.mx/andrea/mxdydni/login',
			posicionGlobalUrl:
				'https://test.bbvanet.com.mx/andrea/mxdydni/posicionGlobal?entrada=login',
			loginFormHeading: 'h1',
			cardInput: 'Número de tarjeta',
			passwordInput: 'Contraseña',
			continueButton: 'Continuar',
			// Inspeccionado via MCP Playwright en /andrea/mxdydni/posicionGlobal — atributo id
			globalPositionContainer: '#madre',
			clientNameContainer: '#cornonita-user-name',
			tdcIframe: '#tdcDetails',
			// Inspeccionado via MCP Playwright en iframe ngob/globalPosition SPA — atributo class
			accountCardSelector: '.title.style-scope.cells-widget-product-card',
			greetingSelector: 'span.message.style-scope.cells-icon-message',
			// CP2 — Inspeccionado via MCP Playwright en /ngob/globalPosition SPA — atributo class (único en DOM)
			imprimirSaldosButton: 'span.buttonTitle.cells-products-paginator',
			// CP2 — Ruta destino del PDF descargado
			balancePdfDownloadPath: path.resolve(
				__dirname,
				'..',
				'output',
				'descarga.pdf'
			),
		}
	}

	async loginWithTddAndPassword(card: string, password: string) {
		I.amOnPage(this.fields.loginUrl)
		I.waitForElement(this.fields.loginFormHeading, 30)
		I.fillField(this.fields.cardInput, card)
		I.fillField(this.fields.passwordInput, password)
		I.click(this.fields.continueButton)
		// After login establishes session, navigate directly to global position
		I.amOnPage(this.fields.posicionGlobalUrl)
		I.waitForElement(this.fields.globalPositionContainer, 30)
	}

	async verifyGlobalPositionLoaded() {
		I.seeElement(this.fields.globalPositionContainer)
	}

	async verifyClientAliasVisible() {
		I.seeElement(this.fields.clientNameContainer)
	}

	async verifyAccountTypesVisible() {
		I.waitForElement(this.fields.tdcIframe, 30)
		I.switchTo(this.fields.tdcIframe)
		I.waitForElement(this.fields.accountCardSelector, 30)
		I.see('Cuenta de débito')
		I.see('Tarjeta de crédito')
		I.switchTo(null)
	}

	// CP2 — Click "Imprimir saldos" inside the tdcDetails iframe to trigger PDF download.
	// I.handleDownloads() sets the Playwright-level download listener before the click.
	// I.wait(5) allows the download to complete before the verification step runs.
	async clickImprimirSaldosAndDownload() {
		I.handleDownloads(this.fields.balancePdfDownloadPath)
		I.switchTo(this.fields.tdcIframe)
		I.waitForElement(this.fields.imprimirSaldosButton, 30)
		I.click(this.fields.imprimirSaldosButton)
		I.switchTo(null)
		I.wait(5)
	}

	// CP2 — Verify the balance PDF file was saved to disk after clicking "Imprimir saldos".
	// Uses I.fileExists() (custom actor method defined in steps_file.ts).
	async verifyBalancePdfDownloaded() {
		const exists = await I.fileExists(this.fields.balancePdfDownloadPath)
		if (!exists) {
			throw new Error(
				`[CP2] Balance PDF was not downloaded. Expected file at: ${this.fields.balancePdfDownloadPath}`
			)
		}
	}
}

export = new BbvaLoginPage()
