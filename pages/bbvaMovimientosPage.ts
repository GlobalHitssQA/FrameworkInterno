import path from 'path'

const { I } = inject()

class BbvaMovimientosPage {
	fields: {
		// Iframe que envuelve el SPA de movimientos en posicionGlobalNgob
		// Inspeccionado via MCP Playwright en /posicionGlobalNgob — atributo id
		movimientosIframe: string
		// Iframe de posición global (para interacción con menú de tres puntos)
		// Inspeccionado via MCP Playwright en /posicionGlobal — atributo id
		tdcIframe: string
		// IDs para navegar la cadena de shadow DOM del filtro de período
		// Inspeccionado via MCP Playwright en /posicionGlobalNgob — análisis de shadow DOM chain:
		// check-account-page.shadowRoot → cells-check-account-movements.shadowRoot → csg-with-calendar#csgCalendar.shadowRoot
		periodCalendarId: string
		periodToggleId: string
		periodOptionClass: string
		periodPlaceholderClass: string
		// Clases de columnas de tabla en el shadow DOM de cells-check-account-movements
		// Inspeccionado via MCP Playwright en /posicionGlobalNgob — cells-check-account-movements shadowRoot
		fechaColumnClass: string
		descripcionColumnClass: string
		montoColumnClass: string
		saldoColumnClass: string
		// Contenedor de opciones de exportación (dom-if activo cuando hay movimientos)
		// Inspeccionado via MCP Playwright — dom-module template de cells-check-account-movements
		exportContainerClass: string
		// CP4 — Rutas de descarga de movimientos en PDF y Excel
		movementsPdfPath: string
		movementsExcelPath: string
	}

	constructor() {
		this.fields = {
			movimientosIframe: '#genericFrameCells',
			tdcIframe: '#tdcDetails',
			periodCalendarId: '#csgCalendar',
			periodToggleId: '#toggle',
			periodOptionClass: '.option',
			periodPlaceholderClass: '.toggle__placeholder',
			fechaColumnClass: 'cells-th.ngob-theme-colum-date',
			descripcionColumnClass: 'cells-th.ngob-theme-colum-description',
			montoColumnClass: 'cells-th.ngob-theme-colum-amount',
			saldoColumnClass: 'cells-th.ngob-theme-colum-balance',
			exportContainerClass: '.export-options-container',
			// CP4 — Rutas destino de archivos descargados desde la pantalla de movimientos
			// Inspeccionado via MCP Playwright en /posicionGlobalNgob — métodos _exportPdf() y _exportExcel()
			// del componente cells-check-account-movements en shadow DOM de #genericFrameCells
			movementsPdfPath: path.resolve(
				__dirname,
				'..',
				'output',
				'movimientos_descarga.pdf'
			),
			movementsExcelPath: path.resolve(
				__dirname,
				'..',
				'output',
				'movimientos_descarga.xlsx'
			),
		}
	}

	// Abre el menú de tres puntos (•••) del card de cuenta en pesos (Cuenta de débito)
	// en la página de posición global y hace click en "Movimientos".
	// Usa I.usePlaywrightTo() porque la interacción está dentro del iframe #tdcDetails
	// en el shadow DOM de Polymer (cells-menu-options / paper-menu-button), inaccesible
	// mediante selectores estándar de CodeceptJS o I.switchTo().
	async openPesoAccountMovements() {
		const { movimientosIframe } = this.fields
		await I.usePlaywrightTo(
			'open three-dots menu on peso account card and click Movimientos',
			async ({ page }) => {
				await page.evaluate(() => {
					const iframe = document.getElementById('tdcDetails')
					const doc =
						iframe.contentDocument || iframe.contentWindow.document
					// El primer cells-menu-options pertenece a la tarjeta de cuenta en pesos (Cuenta de débito)
					const firstMenu =
						doc.querySelectorAll('cells-menu-options')[0]
					// Abre el paper-menu-button de Polymer programáticamente (click simple no lo dispara)
					const paperBtn =
						firstMenu.querySelector('paper-menu-button')
					if (paperBtn && typeof paperBtn.open === 'function') {
						paperBtn.open()
					}
					// Encuentra y hace click en el ítem "Movimientos"
					const items = firstMenu.querySelectorAll('paper-item')
					items.forEach((item) => {
						if ((item.textContent || '').trim() === 'Movimientos') {
							item.click()
						}
					})
				})
			}
		)
		I.waitForElement(movimientosIframe, 30)
	}

	// CP5 — Abre el menú de tres puntos (•••) del card de TDC (Tarjeta de Crédito)
	// en la página de posición global y hace click en "Movimientos".
	// Usa I.usePlaywrightTo() porque la interacción está dentro del iframe #tdcDetails
	// en el shadow DOM de Polymer (cells-menu-options / paper-menu-button), inaccesible
	// mediante selectores estándar de CodeceptJS o I.switchTo().
	// [RALPH-SIN-RESOLVER] El índice [1] asume que el card TDC es el segundo
	// cells-menu-options en el iframe. El MCP no pudo completar la navegación hasta
	// la pantalla de posición global (sesión expirada antes de cargar el iframe).
	// Requiere verificación manual del índice exacto en el DOM de #tdcDetails.
	async openTdcAccountMovements() {
		const { movimientosIframe } = this.fields
		await I.usePlaywrightTo(
			'open three-dots menu on TDC card and click Movimientos',
			async ({ page }) => {
				await page.evaluate(() => {
					const iframe = document.getElementById('tdcDetails')
					const doc =
						iframe.contentDocument || iframe.contentWindow.document
					// [RALPH-SIN-RESOLVER] Índice [1] = segundo cells-menu-options = TDC.
					// El índice [0] ya está documentado como Cuenta de débito en openPesoAccountMovements().
					// Verificar en el DOM real que el card TDC sea efectivamente el índice [1].
					const tdcMenu =
						doc.querySelectorAll('cells-menu-options')[1]
					const paperBtn = tdcMenu.querySelector('paper-menu-button')
					if (paperBtn && typeof paperBtn.open === 'function') {
						paperBtn.open()
					}
					const items = tdcMenu.querySelectorAll('paper-item')
					items.forEach((item) => {
						if ((item.textContent || '').trim() === 'Movimientos') {
							item.click()
						}
					})
				})
			}
		)
		I.waitForElement(movimientosIframe, 30)
	}

	// Selecciona un período en el dropdown de filtro de la página de movimientos.
	// Usa I.usePlaywrightTo() porque el filtro está dentro del iframe #genericFrameCells
	// en la cadena de shadow DOM de Polymer (check-account-page →
	// cells-check-account-movements → csg-with-calendar), inaccesible con CodeceptJS estándar.
	async selectMovementsPeriod(period: string) {
		await I.usePlaywrightTo(
			`select movements period: ${period}`,
			async ({ page }) => {
				await page.evaluate((periodOption) => {
					const iframe = document.getElementById('genericFrameCells')
					const doc =
						iframe.contentDocument || iframe.contentWindow.document
					const cap = doc.querySelector('check-account-page')
					const movComp = cap.shadowRoot.querySelector(
						'cells-check-account-movements'
					)
					const movShadow = movComp.shadowRoot
					const csgCalendar = movShadow.querySelector('#csgCalendar')
					const csgShadow = csgCalendar.shadowRoot
					// Abre el toggle del dropdown de período
					csgShadow.querySelector('#toggle').click()
					// Encuentra y hace click en la opción que coincide con el período
					const options = csgShadow.querySelectorAll('.option')
					options.forEach((opt) => {
						if ((opt.textContent || '').trim() === periodOption) {
							opt.click()
						}
					})
				}, period)
			}
		)
	}

	// Verifica que el placeholder del filtro de período muestre el nombre del período esperado.
	// Usa I.usePlaywrightTo() porque el elemento está en la cadena de shadow DOM profunda
	// dentro del iframe #genericFrameCells.
	async verifyPeriodFilterLabel(period: string) {
		await I.usePlaywrightTo(
			`verify period filter label shows "${period}"`,
			async ({ page }) => {
				await page.evaluate((expectedPeriod) => {
					const iframe = document.getElementById('genericFrameCells')
					const doc =
						iframe.contentDocument || iframe.contentWindow.document
					const cap = doc.querySelector('check-account-page')
					const movComp = cap.shadowRoot.querySelector(
						'cells-check-account-movements'
					)
					const movShadow = movComp.shadowRoot
					const csgCalendar = movShadow.querySelector('#csgCalendar')
					const csgShadow = csgCalendar.shadowRoot
					const placeholder = csgShadow.querySelector(
						'.toggle__placeholder'
					)
					const actual = placeholder
						? (placeholder.textContent || '').trim()
						: ''
					if (actual !== expectedPeriod) {
						throw new Error(
							`[CP3] Expected period label "${expectedPeriod}" but found "${actual}"`
						)
					}
				}, period)
			}
		)
	}

	// Verifica que los encabezados de la tabla de movimientos estén presentes:
	// FECHA, DESCRIPCIÓN, MONTO y SALDO TOTAL.
	// Nota: el caso de prueba los denomina "Fecha", "Descripción", "Importe" y "Saldo"
	// pero los labels reales en el DOM son "FECHA", "DESCRIPCIÓN", "MONTO" y "SALDO TOTAL".
	// Usa I.usePlaywrightTo() porque los headers están en el shadow DOM de
	// cells-check-account-movements dentro del iframe #genericFrameCells.
	async verifyMovementsTableHeaders() {
		await I.usePlaywrightTo(
			'verify table headers FECHA DESCRIPCION MONTO SALDO TOTAL are present',
			async ({ page }) => {
				await page.evaluate(() => {
					const iframe = document.getElementById('genericFrameCells')
					const doc =
						iframe.contentDocument || iframe.contentWindow.document
					const cap = doc.querySelector('check-account-page')
					const movComp = cap.shadowRoot.querySelector(
						'cells-check-account-movements'
					)
					const movShadow = movComp.shadowRoot
					const ths = movShadow.querySelectorAll('cells-th')
					const headerTexts = Array.from(ths).map((th) =>
						(th.textContent || '').trim()
					)
					const required = [
						'FECHA',
						'DESCRIPCIÓN',
						'MONTO',
						'SALDO TOTAL',
					]
					required.forEach((col) => {
						if (headerTexts.indexOf(col) === -1) {
							throw new Error(
								`[CP3] Table column "${col}" not found. Headers present: ${headerTexts.join(
									', '
								)}`
							)
						}
					})
				})
			}
		)
	}

	// Verifica que los botones de exportación PDF, Excel e Imprimir estén disponibles
	// en la página de movimientos.
	// Los botones se renderizan dentro de un dom-if cuya condición (_shouldExportOptionsBeVisible)
	// se activa cuando hay movimientos cargados. Espera hasta 15 segundos.
	// Usa I.usePlaywrightTo() porque el contenedor está en el shadow DOM de
	// cells-check-account-movements dentro del iframe #genericFrameCells.
	async verifyExportOptionsAvailable() {
		await I.usePlaywrightTo(
			'verify PDF Excel and print export options are available',
			async ({ page }) => {
				await page.waitForFunction(
					() => {
						const iframe =
							document.getElementById('genericFrameCells')
						if (!iframe) return false
						const doc =
							iframe.contentDocument ||
							iframe.contentWindow.document
						const cap = doc.querySelector('check-account-page')
						if (!cap || !cap.shadowRoot) return false
						const movComp = cap.shadowRoot.querySelector(
							'cells-check-account-movements'
						)
						if (!movComp || !movComp.shadowRoot) return false
						const exportContainer =
							movComp.shadowRoot.querySelector(
								'.export-options-container'
							)
						if (!exportContainer) return false
						const text = exportContainer.textContent || ''
						return (
							text.indexOf('Imprimir') !== -1 &&
							text.indexOf('PDF') !== -1 &&
							text.indexOf('Excel') !== -1
						)
					},
					{ timeout: 15000 }
				)
			}
		)
	}

	// CP4 — Descarga los movimientos en formato PDF llamando a _exportPdf() en el componente
	// cells-check-account-movements que reside en la cadena de shadow DOM dentro de #genericFrameCells.
	// page.waitForEvent('download') se registra ANTES de disparar la descarga para capturarla.
	// Inspeccionado via MCP Playwright en /posicionGlobalNgob — método _exportPdf() encontrado en prototipo.
	// Usa I.usePlaywrightTo() porque el componente es inaccesible con métodos estándar de CodeceptJS.
	async downloadMovementsAsPdf() {
		const pdfPath = this.fields.movementsPdfPath
		await I.usePlaywrightTo(
			'download movements as PDF via _exportPdf()',
			async ({ page }) => {
				const downloadPromise = page.waitForEvent('download', {
					timeout: 15000,
				})
				await page.evaluate(() => {
					const iframe = document.getElementById('genericFrameCells')
					const doc =
						iframe.contentDocument || iframe.contentWindow.document
					const cap = doc.querySelector('check-account-page')
					const movComp = cap.shadowRoot.querySelector(
						'cells-check-account-movements'
					)
					movComp._exportPdf()
				})
				const download = await downloadPromise
				await download.saveAs(pdfPath)
			}
		)
	}

	// CP4 — Descarga los movimientos en formato Excel llamando a _exportExcel() en el componente.
	// Mismo enfoque que downloadMovementsAsPdf() pero para Excel (.xlsx).
	// Inspeccionado via MCP Playwright en /posicionGlobalNgob — método _exportExcel() encontrado en prototipo.
	// Usa I.usePlaywrightTo() porque el componente es inaccesible con métodos estándar de CodeceptJS.
	async downloadMovementsAsExcel() {
		const excelPath = this.fields.movementsExcelPath
		await I.usePlaywrightTo(
			'download movements as Excel via _exportExcel()',
			async ({ page }) => {
				const downloadPromise = page.waitForEvent('download', {
					timeout: 15000,
				})
				await page.evaluate(() => {
					const iframe = document.getElementById('genericFrameCells')
					const doc =
						iframe.contentDocument || iframe.contentWindow.document
					const cap = doc.querySelector('check-account-page')
					const movComp = cap.shadowRoot.querySelector(
						'cells-check-account-movements'
					)
					movComp._exportExcel()
				})
				const download = await downloadPromise
				await download.saveAs(excelPath)
			}
		)
	}

	// CP4 — Dispara la impresión de movimientos llamando a _printMovements() en el componente.
	// En modo headless, Chromium gestiona el evento de impresión silenciosamente.
	// Inspeccionado via MCP Playwright en /posicionGlobalNgob — método _printMovements() encontrado en prototipo.
	// Usa I.usePlaywrightTo() porque el componente está en shadow DOM profundo inaccesible
	// con métodos estándar de CodeceptJS.
	async printMovements() {
		const iframeSelector = this.fields.movimientosIframe
		await I.usePlaywrightTo(
			'trigger print for movements via _printMovements()',
			async ({ page }) => {
				await page.evaluate((sel) => {
					const iframe = document.querySelector(sel)
					const doc =
						iframe.contentDocument || iframe.contentWindow.document
					const cap = doc.querySelector('check-account-page')
					const movComp = cap.shadowRoot.querySelector(
						'cells-check-account-movements'
					)
					movComp._printMovements()
				}, iframeSelector)
				// Espera breve para que el proceso de impresión/generación se establezca
				await page.waitForTimeout(2000)
			}
		)
	}

	// CP4 — Verifica que el archivo PDF de movimientos fue descargado correctamente en disco.
	// Usa I.fileExists() definido en steps_file.ts.
	async verifyMovementsPdfDownloaded() {
		const exists = await I.fileExists(this.fields.movementsPdfPath)
		if (!exists) {
			throw new Error(
				`[CP4] Movements PDF was not downloaded. Expected file at: ${this.fields.movementsPdfPath}`
			)
		}
	}

	// CP4 — Verifica que el archivo Excel de movimientos fue descargado correctamente en disco.
	// Usa I.fileExists() definido en steps_file.ts.
	async verifyMovementsExcelDownloaded() {
		const exists = await I.fileExists(this.fields.movementsExcelPath)
		if (!exists) {
			throw new Error(
				`[CP4] Movements Excel was not downloaded. Expected file at: ${this.fields.movementsExcelPath}`
			)
		}
	}
}

export = new BbvaMovimientosPage()
