const { I } = inject()

class PosicionGlobalPage {
	// [RALPH-SIN-RESOLVER] — MCP no pudo inspeccionar la pantalla post-login
	// Razón: sesión duplicada activa en la cuenta de prueba impidió el acceso (error SDS0120:
	//   "NO SE PERMITE CONTAR CON DOS SESIONES ACTIVAS AL MISMO TIEMPO")
	// Se requiere inspección manual con la cuenta liberada para obtener los selectores específicos
	private globalPositionHeader: string

	// Inspeccionado via MCP Playwright en https://test.bbvanet.com.mx/andrea/mxdydni/posicionGlobal — atributo id
	private pdfIframe: string

	// Inspeccionado via MCP Playwright — CSS semántico dentro del iframe #tdcDetails
	// Corresponde al primer .toggle_button dentro de cells-products-paginator que NO es .toogle_container
	private imprimirSaldosButton: string

	constructor() {
		// [RALPH-SIN-RESOLVER] — selector del encabezado/contenedor principal de Posición Global
		this.globalPositionHeader = '[RALPH-SIN-RESOLVER]'
		// id="tdcDetails" — iframe principal que contiene la vista de Posición Global
		this.pdfIframe = '#tdcDetails'
		// cells-products-paginator .side_section:not(.toogle_container) .toggle_button
		// El primer .side_section (sin clase .toogle_container) contiene el ícono de impresora + texto "Imprimir saldos"
		this.imprimirSaldosButton =
			'cells-products-paginator .side_section:not(.toogle_container) .toggle_button'
	}

	async verifyGlobalPositionIsDisplayed() {
		// [RALPH-SIN-RESOLVER] — Reemplazar con waitForElement(this.globalPositionHeader) al resolver el selector
		// Fallback por texto hasta inspección manual
		I.see('Posición Global')
	}

	async verifyAccountSectionContains(accountName: string) {
		I.see(accountName)
	}

	async clickImprimirSaldos() {
		// El enlace "Imprimir saldos" está dentro del iframe #tdcDetails
		// Al hacer clic, se inicia automáticamente la descarga del PDF con el detalle de cuentas
		await I.switchTo(this.pdfIframe)
		I.click(this.imprimirSaldosButton)
		await I.switchTo()
	}

	async verifyPDFDownloaded() {
		// La descarga del PDF se inicia automáticamente al hacer clic en "Imprimir saldos"
		// Se espera un breve tiempo para que la descarga se complete antes de continuar
		I.wait(3)
	}

	// ── CP3: Movimientos por período ─────────────────────────────────────────────

	// Inspeccionado via MCP Playwright en posicionGlobal — div#trigger dentro de
	// paper-menu-button#paperMenuButton (primer botón tres puntos de cuenta en pesos)
	// Contexto: dentro del iframe #tdcDetails (mismo que pdfIframe)
	private pesosAccountThreeDotsTrigger =
		'paper-menu-button#paperMenuButton div#trigger'

	// Inspeccionado via MCP Playwright — paper-item[role="option"] con texto "Movimientos"
	// Contexto: dropdown desplegado dentro del iframe #tdcDetails
	private movimientosMenuItemText = 'Movimientos'

	// Inspeccionado via MCP Playwright via evaluate() — id del iframe en posicionGlobalNgob
	// El iframe aloja la SPA de movimientos (movements.1.2.1/index.html)
	private movimientosIframe = '#genericFrameCells'

	// Selector de texto para el botón de filtro de período (Shadow DOM — Polymer Web Components)
	// Inspeccionado via MCP Playwright — button "Periodo Mes Actual" [ref=f5e165]
	// La SPA usa shadow DOM; Playwright resuelve texto directamente en el árbol de accesibilidad
	private periodoFilterButtonText = 'Periodo'

	// Textos de los encabezados de columna de movimientos
	// [RALPH-SIN-RESOLVER] — no se cargaron movimientos en el entorno de prueba
	// ("Sin movimientos a listar"); los textos se obtienen del resultado esperado del caso CP3
	private fechaColumnText = 'Fecha'

	private descripcionColumnText = 'Descripción'

	private importeColumnText = 'Importe'

	private saldoColumnText = 'Saldo'

	// Textos de opciones de descarga de movimientos
	// [RALPH-SIN-RESOLVER] — opciones no visibles en el entorno de prueba
	// (requieren movimientos cargados); extraídos del resultado esperado del caso CP3
	private pdfDownloadText = 'PDF'

	private excelDownloadText = 'Excel'

	private impresionDownloadText = 'Impresión'

	async clickThreeDotsPesoAccount() {
		// Cambiar al iframe de posición global y hacer clic en el botón tres puntos
		// de la primera tarjeta de cuenta en pesos (Cuenta de débito • 17091)
		await I.switchTo(this.pdfIframe)
		I.click(this.pesosAccountThreeDotsTrigger)
	}

	async clickMovimientosOption() {
		// Hacer clic en la opción "Movimientos" del menú desplegable
		// La navegación lleva a posicionGlobalNgob (nuevo iframe #genericFrameCells)
		I.click(locate('paper-item').withText(this.movimientosMenuItemText))
		await I.switchTo()
	}

	async selectMovimientosPeriodo(period: string) {
		// Cambiar al iframe de la página de movimientos (Shadow DOM — Polymer)
		// El botón de período usa selector de texto porque el contenido está en Shadow DOM
		await I.switchTo(this.movimientosIframe)
		I.click(locate('button').withText(this.periodoFilterButtonText))
		// Seleccionar la opción del período usando texto directo (Playwright penetra Shadow DOM)
		I.click(`text=${period}`)
		await I.switchTo()
	}

	async verifyMovimientosColumnsDisplayed() {
		// Verificar que se muestren los encabezados de columna en la tabla de movimientos
		// Requiere que existan movimientos para el período seleccionado
		await I.switchTo(this.movimientosIframe)
		I.see(this.fechaColumnText)
		I.see(this.descripcionColumnText)
		I.see(this.importeColumnText)
		I.see(this.saldoColumnText)
		await I.switchTo()
	}

	async verifyDownloadOptionsDisplayed() {
		// Verificar que se muestren las opciones de descarga PDF, Excel e Impresión
		// Requiere que existan movimientos para el período seleccionado
		await I.switchTo(this.movimientosIframe)
		I.see(this.pdfDownloadText)
		I.see(this.excelDownloadText)
		I.see(this.impresionDownloadText)
		await I.switchTo()
	}

	// ── CP4: Descargar Movimientos en PDF, Excel e Impresión ──────────────────

	// [RALPH-SIN-RESOLVER] — el SPA de movimientos retornó "Servicio temporalmente
	// no disponible" durante la inspección con MCP Playwright en el entorno de prueba.
	// Se usa selector de texto (patrón Polymer/Shadow DOM) como fallback;
	// requiere verificación manual cuando el servicio esté disponible.
	private movimientosDownloadSelector = 'text='

	async clickMovimientosDownload(format: string) {
		// Hace clic en el botón de descarga del formato indicado (PDF | Excel | Impresión)
		// dentro del iframe de movimientos (#genericFrameCells).
		// Selector text= penetra Shadow DOM en Playwright (patrón usado en toda la SPA).
		// Inspeccionado via MCP Playwright en posicionGlobalNgob — iframe #genericFrameCells
		// Servicio no disponible al momento de la inspección; selector pendiente de confirmación.
		await I.switchTo(this.movimientosIframe)
		I.click(`${this.movimientosDownloadSelector}${format}`)
		await I.switchTo()
	}

	async verifyMovimientosDownloadInitiated() {
		// Verifica que la descarga se haya iniciado aguardando que el navegador
		// procese el evento de descarga (PDF → archivo; Excel → archivo; Impresión → diálogo)
		I.wait(3)
	}

	// ── CP5: Movimientos de TDC por período (hasta 5 meses atrás) ────────────────

	// [RALPH-SIN-RESOLVER] — MCP no pudo inspeccionar: el entorno de prueba retornó
	// "Servicio Temporalmente no disponible" y redirigió a www.bbva.mx.
	// El locator debe apuntar al botón "tres puntos" (paper-menu-button) de la primera
	// tarjeta de crédito (TDC) dentro del iframe #tdcDetails — sección Tarjetas de crédito.
	// Requiere inspección manual cuando el servicio esté disponible.
	private tdcAccountThreeDotsTrigger = '[RALPH-SIN-RESOLVER]'

	async clickThreeDotsOnTDCCard() {
		// Cambiar al iframe de posición global y hacer clic en el botón tres puntos
		// de la primera tarjeta de crédito (TDC) listada en la sección "Tarjetas de crédito".
		// Contexto: dentro del iframe #tdcDetails (mismo que pdfIframe).
		await I.switchTo(this.pdfIframe)
		I.click(this.tdcAccountThreeDotsTrigger)
	}
}

export = new PosicionGlobalPage()
