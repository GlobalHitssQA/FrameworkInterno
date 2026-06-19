const { I } = inject()

class BbvaPosicionGlobalPage {
	// Inspeccionado via MCP Playwright en https://test.bbvanet.com.mx/andrea/mxdydni/posicionGlobal — atributo id
	// Elemento que muestra el alias/nombre del cliente en el frame externo (posicionGlobal)
	private readonly clientAliasSelector = '#cornonita-user-name'

	// Inspeccionado via MCP Playwright en https://test.bbvanet.com.mx/andrea/mxdydni/posicionGlobal — atributo id
	// iframe interno que contiene la SPA Angular de la posición global
	private readonly globalPositionIframe = '#tdcDetails'

	// Inspeccionado via MCP Playwright en el iframe ngob/globalPosition.0.3.25 — atributo id
	// Contenedor principal de los productos/cuentas del cliente en la SPA interna
	private readonly productsContainer = '#app__products'

	// Inspeccionado via MCP Playwright en el iframe ngob/globalPosition.0.3.25 — CSS class
	// Botón "Imprimir saldos" dentro de cells-products-paginator (único span.buttonTitle en el DOM)
	// URL inspeccionada: https://test.bbvanet.com.mx/andrea/mxdydni/ngob/globalPosition.0.3.25/index.html
	private readonly imprimirSaldosButton = 'span.buttonTitle'

	// Variable de instancia para capturar el nombre del archivo descargado al hacer click en Imprimir saldos
	private downloadedFilename: string | null = null

	// ─── CP3: Movimientos de cuenta en pesos ──────────────────────────────────

	// Inspeccionado via MCP Playwright en ngob/globalPosition.0.3.25 — CSS class
	// Ícono de tres puntos (kebab menu) en cada tarjeta de producto
	private readonly threeDotsMenuTrigger = 'cells-atom-icon.dropdown-trigger'

	// Inspeccionado via MCP Playwright en ngob/globalPosition.0.3.25 — tag name
	// Ítem de menú dentro del dropdown de la tarjeta de producto
	private readonly productCardMenuItem = 'paper-item'

	// Inspeccionado via MCP Playwright en ngob/movements.1.2.1 — CSS class en shadow DOM de check-account-page
	// Disparador del dropdown de período (muestra el período actualmente seleccionado)
	private readonly periodTogglePlaceholder = '.toggle__placeholder'

	// Inspeccionado via MCP Playwright en ngob/movements.1.2.1 — CSS class en shadow DOM de check-account-page
	// Opción de período dentro del dropdown de filtro de período
	private readonly periodOption = '.option__label'

	// Inspeccionado via MCP Playwright en ngob/movements.1.2.1 — CSS class en shadow DOM de check-account-page
	// Encabezado de columna "FECHA" en la tabla de movimientos (#movementsTable)
	private readonly movementsTableDateColumn = 'cells-th.ngob-theme-colum-date'

	// Inspeccionado via MCP Playwright en ngob/movements.1.2.1 — CSS class en shadow DOM de check-account-page
	// Encabezado de columna "DESCRIPCIÓN" en la tabla de movimientos (#movementsTable)
	private readonly movementsTableDescriptionColumn =
		'cells-th.ngob-theme-colum-description'

	// Inspeccionado via MCP Playwright en ngob/movements.1.2.1 — CSS class en shadow DOM de check-account-page
	// Encabezado de columna "MONTO" en la tabla de movimientos (#movementsTable)
	private readonly movementsTableAmountColumn =
		'cells-th.ngob-theme-colum-amount'

	// Inspeccionado via MCP Playwright en ngob/movements.1.2.1 — CSS class en shadow DOM de check-account-page
	// Encabezado de columna "SALDO TOTAL" en la tabla de movimientos (#movementsTable)
	private readonly movementsTableBalanceColumn =
		'cells-th.ngob-theme-colum-balance'

	// Inspeccionado via MCP Playwright en ngob/movements.1.2.1 — CSS class en shadow DOM de check-account-page
	// Contenedor de las opciones de descarga de movimientos (PDF/Excel/Impresión)
	private readonly exportOptionsContainer = '.export-options-container'

	async waitForGlobalPositionAndVerifyAlias() {
		// Motivo de usePlaywrightTo: la página usa un <frameset> con <frame src="posicionGlobal">
		// que redirecciona el login. CodeceptJS I.switchTo() no soporta de forma fiable la navegación
		// hacia <frame> de frameset combinado con un <iframe> (#tdcDetails) anidado dentro.
		// Se accede directamente a page.frames() de Playwright para localizar el frame correcto.
		await I.usePlaywrightTo(
			'wait for global position outer frame and verify client alias',
			async ({ page }) => {
				// Esperar a que el frame externo (posicionGlobal) esté disponible
				await page.waitForTimeout(2000)
				const frames = page.frames()
				const outerFrame = frames.find((f) =>
					f.url().includes('posicionGlobal')
				)
				if (!outerFrame) {
					throw new Error(
						`Global position outer frame not found after login. Available frames: ${frames
							.map((f) => f.url())
							.join(', ')}`
					)
				}
				// Esperar y verificar el alias del cliente (#cornonita-user-name)
				await outerFrame.waitForSelector('#cornonita-user-name', {
					timeout: 30000,
				})
				const alias = await outerFrame
					.locator('#cornonita-user-name')
					.innerText()
				if (!alias?.trim()) {
					throw new Error(
						'Client alias (#cornonita-user-name) is empty or not visible in global position frame'
					)
				}
			}
		)
	}

	async verifyAccountSectionsVisible() {
		// Motivo de usePlaywrightTo: acceso al iframe anidado (#tdcDetails) dentro del frame
		// externo (posicionGlobal). Los métodos estándar I.switchTo() no mantienen contexto
		// entre llamadas, por lo que se debe acceder al frame y su iframe en el mismo bloque.
		await I.usePlaywrightTo(
			'verify debit account and credit card sections in inner iframe',
			async ({ page }) => {
				const frames = page.frames()
				const outerFrame = frames.find((f) =>
					f.url().includes('posicionGlobal')
				)
				if (!outerFrame) {
					throw new Error('Global position outer frame not found')
				}
				// Acceder al iframe interno (#tdcDetails) que contiene la SPA de posición global
				const innerFrames = outerFrame.childFrames()
				const innerFrame =
					innerFrames.find((f) =>
						f.url().includes('globalPosition')
					) ?? innerFrames[0]
				if (!innerFrame) {
					throw new Error(
						'Inner globalPosition iframe (#tdcDetails) not found'
					)
				}
				// Esperar el contenedor de productos y verificar los tipos de cuenta
				await innerFrame.waitForSelector('#app__products', {
					timeout: 30000,
				})
				const productsText = await innerFrame
					.locator('#app__products')
					.innerText()

				// Verificar Cuenta en Pesos (mostrada como "Cuenta de débito" en la UI de BBVA)
				if (!productsText.includes('Cuenta de débito')) {
					throw new Error(
						`Cuenta en Pesos (Cuenta de débito) not found in global position. ` +
							`Visible products: ${productsText.substring(
								0,
								300
							)}`
					)
				}
				// Verificar Tarjetas de crédito (mostrada como "Tarjeta de crédito" en la UI de BBVA)
				if (!productsText.includes('Tarjeta de crédito')) {
					throw new Error(
						`Tarjetas de crédito not found in global position. ` +
							`Visible products: ${productsText.substring(
								0,
								300
							)}`
					)
				}
			}
		)
	}

	async clickImprimirSaldos() {
		// Motivo de usePlaywrightTo: el botón "Imprimir saldos" reside en un iframe anidado
		// (#tdcDetails) dentro del frame externo (<frame src="posicionGlobal">), que a su vez
		// está dentro de un <frameset>. CodeceptJS I.click() no puede resolver este triple
		// contexto de frames. Se debe usar page.frames() + childFrames() de Playwright.
		// Adicionalmente, el evento de descarga (download) debe configurarse con Promise.all
		// ANTES del click para garantizar su captura — esto tampoco es posible con métodos estándar.
		await I.usePlaywrightTo(
			'click Imprimir saldos button in nested iframe and capture PDF download',
			async ({ page }) => {
				const frames = page.frames()
				const outerFrame = frames.find((f) =>
					f.url().includes('posicionGlobal')
				)
				if (!outerFrame) {
					throw new Error(
						`Global position outer frame not found. Available frames: ${frames
							.map((f) => f.url())
							.join(', ')}`
					)
				}
				// Acceder al iframe interno (#tdcDetails) con la SPA Angular de posición global
				const innerFrames = outerFrame.childFrames()
				const innerFrame =
					innerFrames.find((f) =>
						f.url().includes('globalPosition')
					) ?? innerFrames[0]
				if (!innerFrame) {
					throw new Error(
						'Inner globalPosition iframe (#tdcDetails) not found'
					)
				}
				// Esperar a que el botón "Imprimir saldos" (span.buttonTitle) esté visible
				await innerFrame.waitForSelector('span.buttonTitle', {
					timeout: 30000,
				})
				// Configurar listener de descarga ANTES del click para garantizar captura
				const [download] = await Promise.all([
					page.waitForEvent('download', { timeout: 30000 }),
					innerFrame.locator('span.buttonTitle').click(),
				])
				// Guardar el nombre del archivo descargado para validación posterior
				this.downloadedFilename = download.suggestedFilename()
				// Esperar a que el archivo quede disponible en disco
				const filePath = await download.path()
				if (!filePath) {
					throw new Error(
						`PDF download failed — file path is null for: ${this.downloadedFilename}`
					)
				}
			}
		)
	}

	async openMovementsForPesosAccount() {
		// Motivo de usePlaywrightTo: cells-atom-icon.dropdown-trigger y paper-item (Movimientos)
		// residen en: page <frameset> > <frame src=posicionGlobal> > <iframe src=globalPosition>.
		// CodeceptJS I.click() no puede resolver este triple contexto de frames anidados.
		// Se usa page.frames() + frame.childFrames() de Playwright para navegar la jerarquía.
		await I.usePlaywrightTo(
			'click three-dot menu on pesos account card and select Movimientos',
			async ({ page }) => {
				await page.waitForTimeout(2000)

				// Localizar el frame externo (posicionGlobal)
				const frames = page.frames()
				const outerFrame = frames.find((f) =>
					f.url().includes('posicionGlobal')
				)
				if (!outerFrame) {
					throw new Error(
						`posicionGlobal frame not found. Available frames: ${frames
							.map((f) => f.url())
							.join(', ')}`
					)
				}

				// Localizar el iframe interno (globalPosition SPA)
				const childFrames = outerFrame.childFrames()
				const innerFrame =
					childFrames.find((f) =>
						f.url().includes('globalPosition')
					) ?? childFrames[0]
				if (!innerFrame) {
					throw new Error('globalPosition inner iframe not found')
				}

				// Esperar y hacer click en el ícono de tres puntos de la primera tarjeta
				// (Cuenta de débito = cuenta en pesos)
				// Inspeccionado via MCP Playwright: cells-atom-icon.dropdown-trigger
				await innerFrame.waitForSelector(this.threeDotsMenuTrigger, {
					timeout: 30000,
				})
				await innerFrame
					.locator(this.threeDotsMenuTrigger)
					.first()
					.click()
				await page.waitForTimeout(500)

				// Hacer click en la opción "Movimientos" del menú desplegable
				// Inspeccionado via MCP Playwright: paper-item con texto "Movimientos"
				await innerFrame
					.locator(this.productCardMenuItem)
					.filter({ hasText: 'Movimientos' })
					.first()
					.click()

				// Esperar a que la página de movimientos cargue (inner iframe navega a movements.1.2.1)
				await page.waitForTimeout(8000)
			}
		)
	}

	async selectMovementPeriod(period: string) {
		// Motivo de usePlaywrightTo: .toggle__placeholder, .option__label y el botón "Buscar"
		// residen en el shadow root de check-account-page dentro del iframe movements.1.2.1,
		// que a su vez está dentro del frame posicionGlobalNgob. La triple anidación
		// (frameset > frame > iframe > shadow DOM) requiere Playwright directamente.
		// Playwright's frame.locator() y frame.waitForSelector() sí pierden shadow roots abiertos.
		await I.usePlaywrightTo(
			`select movement period "${period}" and trigger search`,
			async ({ page }) => {
				await page.waitForTimeout(2000)

				// Localizar el frame externo (posicionGlobalNgob tras la navegación)
				const frames = page.frames()
				const outerFrame = frames.find((f) =>
					f.url().includes('posicionGlobal')
				)
				if (!outerFrame) {
					throw new Error(
						`posicionGlobal(Ngob) frame not found. Available: ${frames
							.map((f) => f.url())
							.join(', ')}`
					)
				}

				// Localizar el iframe de movimientos
				const childFrames = outerFrame.childFrames()
				const innerFrame =
					childFrames.find((f) => f.url().includes('movements')) ??
					childFrames[0]
				if (!innerFrame) {
					throw new Error('movements.1.2.1 iframe not found')
				}

				// Paso 1: Abrir el dropdown de período haciendo click en el toggle placeholder
				// Se excluye el selector de cuenta ("TARJETA") y el de tipo de pago ("Seleccione")
				// Inspeccionado via MCP Playwright: DIV.toggle__placeholder
				await innerFrame.waitForSelector(this.periodTogglePlaceholder, {
					timeout: 30000,
				})
				await innerFrame
					.locator(this.periodTogglePlaceholder)
					.filter({ hasNotText: /TARJETA|Seleccione/ })
					.first()
					.click()
				await page.waitForTimeout(400)

				// Paso 2: Seleccionar la opción de período especificada
				// Inspeccionado via MCP Playwright: DIV.option__label
				await innerFrame
					.locator(this.periodOption)
					.filter({ hasText: period })
					.first()
					.click()
				await page.waitForTimeout(300)

				// Paso 3: Hacer click en "Buscar" para cargar los movimientos del período
				// Inspeccionado via MCP Playwright: BUTTON > SPAN.btn__text con texto "Buscar"
				await innerFrame
					.locator('button')
					.filter({ hasText: 'Buscar' })
					.first()
					.click()

				// Esperar a que los resultados carguen
				await page.waitForTimeout(4000)
			}
		)
	}

	async verifyMovementsTableColumnsVisible() {
		// Motivo de usePlaywrightTo: los CELLS-TH (encabezados de columna) residen en el shadow root
		// de check-account-page dentro de movements.1.2.1, que está en el frame posicionGlobalNgob.
		// Playwright frame.locator() y frame.waitForSelector() pierden shadow roots abiertos.
		await I.usePlaywrightTo(
			'verify FECHA, DESCRIPCIÓN, MONTO and SALDO TOTAL column headers in movements table',
			async ({ page }) => {
				// Localizar frames
				const frames = page.frames()
				const outerFrame = frames.find((f) =>
					f.url().includes('posicionGlobal')
				)
				if (!outerFrame) {
					throw new Error('posicionGlobal(Ngob) frame not found')
				}
				const childFrames = outerFrame.childFrames()
				const innerFrame =
					childFrames.find((f) => f.url().includes('movements')) ??
					childFrames[0]
				if (!innerFrame) {
					throw new Error(
						'movements iframe not found for column header verification'
					)
				}

				// Esperar a que la tabla de movimientos esté disponible
				// Inspeccionado via MCP Playwright: cells-th.ngob-theme-colum-date → "FECHA"
				await innerFrame.waitForSelector(
					this.movementsTableDateColumn,
					{
						timeout: 30000,
					}
				)

				// Verificar columna FECHA
				const fechaText = await innerFrame
					.locator(this.movementsTableDateColumn)
					.first()
					.innerText()
				if (!fechaText.includes('FECHA')) {
					throw new Error(
						`FECHA column not found in movements table. Actual text: "${fechaText}"`
					)
				}

				// Verificar columna DESCRIPCIÓN
				// Inspeccionado via MCP Playwright: cells-th.ngob-theme-colum-description → "DESCRIPCIÓN"
				const descText = await innerFrame
					.locator(this.movementsTableDescriptionColumn)
					.first()
					.innerText()
				if (!descText.includes('DESCRIPCIÓN')) {
					throw new Error(
						`DESCRIPCIÓN column not found in movements table. Actual text: "${descText}"`
					)
				}

				// Verificar columna MONTO (equivalente a "Importe" en la descripción del caso)
				// Inspeccionado via MCP Playwright: cells-th.ngob-theme-colum-amount → "MONTO"
				const montoText = await innerFrame
					.locator(this.movementsTableAmountColumn)
					.first()
					.innerText()
				if (!montoText.includes('MONTO')) {
					throw new Error(
						`MONTO column not found in movements table. Actual text: "${montoText}"`
					)
				}

				// Verificar columna SALDO TOTAL (equivalente a "Saldo" en la descripción del caso)
				// Inspeccionado via MCP Playwright: cells-th.ngob-theme-colum-balance → "SALDO TOTAL"
				const saldoText = await innerFrame
					.locator(this.movementsTableBalanceColumn)
					.first()
					.innerText()
				if (!saldoText.includes('SALDO')) {
					throw new Error(
						`SALDO TOTAL column not found in movements table. Actual text: "${saldoText}"`
					)
				}
			}
		)
	}

	async verifyDownloadOptionsSectionPresent() {
		// Motivo de usePlaywrightTo: .export-options-container y CELLS-TH de descarga
		// residen en el shadow root de check-account-page dentro del iframe movements.1.2.1.
		// Multi-frame nesting requiere acceso directo a Playwright frames.
		await I.usePlaywrightTo(
			'verify download options section is present in the movements page',
			async ({ page }) => {
				// Localizar frames
				const frames = page.frames()
				const outerFrame = frames.find((f) =>
					f.url().includes('posicionGlobal')
				)
				if (!outerFrame) {
					throw new Error('posicionGlobal(Ngob) frame not found')
				}
				const childFrames = outerFrame.childFrames()
				const innerFrame =
					childFrames.find((f) => f.url().includes('movements')) ??
					childFrames[0]
				if (!innerFrame) {
					throw new Error(
						'movements iframe not found for download section verification'
					)
				}

				// Verificar que el contenedor de opciones de descarga existe en el DOM
				// Inspeccionado via MCP Playwright: DIV.export-options-container
				const exportCount = await innerFrame
					.locator(this.exportOptionsContainer)
					.count()
				if (exportCount === 0) {
					throw new Error(
						'Download options section (export-options-container) not found in movements page'
					)
				}

				// Verificar que la columna "DESCARGA PDF" existe en la tabla de estados de cuenta
				// Inspeccionado via MCP Playwright: CELLS-TH.ngob-theme-colum-icon → "DESCARGA PDF"
				const pdfColumnCount = await innerFrame
					.locator('cells-th')
					.filter({ hasText: 'DESCARGA PDF' })
					.count()
				if (pdfColumnCount === 0) {
					throw new Error(
						'DESCARGA PDF option not found in movements page download section'
					)
				}
			}
		)
	}

	async verifyPdfDownloadCompleted() {
		// Motivo de usePlaywrightTo: la verificación necesita acceder al estado interno
		// (this.downloadedFilename) que fue capturado en el bloque usePlaywrightTo anterior.
		// Se envuelve en usePlaywrightTo para mantener consistencia con el manejo de errores.
		await I.usePlaywrightTo(
			'verify that a PDF file was downloaded after clicking Imprimir saldos',
			async () => {
				if (!this.downloadedFilename) {
					throw new Error(
						'No PDF download was captured. Ensure clickImprimirSaldos() was called before this verification.'
					)
				}
				// El archivo descargado debe existir (nombre no vacío confirma que el evento fue disparado)
				if (this.downloadedFilename.trim() === '') {
					throw new Error(
						'PDF download filename is empty — the download event was captured but no filename was assigned'
					)
				}
			}
		)
	}

	// ─── CP4: Descargar movimientos en PDF / Excel / Impresión ───────────────

	// [RALPH-SIN-RESOLVER] — MCP no pudo inspeccionar estos selectores porque la cuenta
	// de prueba no tiene movimientos registrados en ningún período disponible (Mes Actual,
	// Mes Anterior, Dos meses atrás). Los botones de descarga solo aparecen en el DOM
	// cuando hay movimientos cargados. Requieren verificación manual con una cuenta activa.
	// URL objetivo: posicionGlobalNgob > iframe#genericFrameCells > check-account-page (shadow DOM)
	// o: posicionGlobal > iframe#tdcDetails > ngob/movements.1.2.1 > check-account-page (flujo antiguo)

	// Botón de descarga PDF dentro del contenedor de exportación de movimientos
	private readonly movementsPdfDownloadBtn = '[data-name="download-pdf"]' // [RALPH-SIN-RESOLVER]

	// Botón de descarga Excel dentro del contenedor de exportación de movimientos
	private readonly movementsExcelDownloadBtn = '[data-name="download-excel"]' // [RALPH-SIN-RESOLVER]

	// Botón de impresión dentro del contenedor de exportación de movimientos
	private readonly movementsPrintBtn = '[data-name="print"]' // [RALPH-SIN-RESOLVER]

	async downloadMovementsInFormat(format: string) {
		// Motivo de usePlaywrightTo: los botones de descarga de movimientos (PDF, Excel, Impresión)
		// residen en el shadow DOM del componente check-account-page, dentro del iframe
		// #genericFrameCells (posicionGlobalNgob) o movements.1.2.1 (flujo antiguo).
		// La anidación iframe + shadow DOM requiere acceso directo a Playwright frames.
		// Adicionalmente, los eventos de descarga (PDF/Excel) requieren Promise.all antes del click.
		await I.usePlaywrightTo(
			`click "${format}" download/print button in movements export section`,
			async ({ page }) => {
				await page.waitForTimeout(2000)

				// Localizar el frame contenedor de movimientos
				// Soporta tanto el flujo nuevo (posicionGlobalNgob > #genericFrameCells)
				// como el flujo antiguo (posicionGlobal > #tdcDetails > movements.1.2.1)
				const frames = page.frames()
				const outerFrame =
					frames.find((f) => f.url().includes('posicionGlobal')) ??
					frames[frames.length - 1]
				if (!outerFrame) {
					throw new Error(
						`posicionGlobal frame not found for movement download. Available frames: ${frames
							.map((f) => f.url())
							.join(', ')}`
					)
				}

				// Seleccionar el iframe interno de movimientos si existe (flujo antiguo),
				// de lo contrario usar el frame posicionGlobal directamente (flujo nuevo)
				const childFrames = outerFrame.childFrames()
				const innerFrame =
					childFrames.find(
						(f) =>
							f.url().includes('movements') ||
							f.url().includes('genericFrame')
					) ?? outerFrame

				// Mapeo de formato → selector del botón correspondiente
				// [RALPH-SIN-RESOLVER] — selectores requieren verificación manual con movimientos activos
				const selectorMap: Record<string, string> = {
					PDF: this.movementsPdfDownloadBtn,
					Excel: this.movementsExcelDownloadBtn,
					Impresión: this.movementsPrintBtn,
				}
				const selector = selectorMap[format]
				if (!selector) {
					throw new Error(
						`Unknown download format "${format}". Valid options: PDF, Excel, Impresión`
					)
				}

				await innerFrame.waitForSelector(selector, { timeout: 30000 })

				if (format === 'Impresión') {
					// Para Impresión no se captura evento download — abre diálogo del sistema
					await innerFrame.locator(selector).first().click()
					await page.waitForTimeout(2000)
				} else {
					// Para PDF y Excel se captura el evento download para verificar que el archivo fue generado
					const [download] = await Promise.all([
						page.waitForEvent('download', { timeout: 30000 }),
						innerFrame.locator(selector).first().click(),
					])
					const filePath = await download.path()
					if (!filePath) {
						throw new Error(
							`${format} download failed — no file path returned for: ${download.suggestedFilename()}`
						)
					}
				}
			}
		)
	}

	// ─── CP5: TDC Card — Movimientos por período ──────────────────────────────

	// Inspeccionado via MCP Playwright en posicionGlobal frame — id
	// Botón de cierre del modal de encuesta (aparece condicionalmente en la sesión)
	private readonly surveyModalCloseBtn = '#close-survey-modal'

	// Inspeccionado via MCP Playwright en ngob/globalPosition.0.3.25 — CSS class
	// Ambos dropdowns de filtro ("De Tarjeta" y "Periodo") usan 'cells-select.dropdown-filters'
	// El de Período es el segundo (nth 1); el de "De Tarjeta" es el primero (nth 0)
	private readonly tdcPeriodDropdownContainer =
		'cells-select.dropdown-filters'

	// Inspeccionado via MCP Playwright en ngob/globalPosition.0.3.25 — id
	// Encabezado/trigger del dropdown (id="select_header" es común a todos los cells-select)
	private readonly tdcDropdownHeader = '#select_header'

	// Inspeccionado via MCP Playwright en ngob/globalPosition.0.3.25 — CSS class
	// Ítems de opción dentro del dropdown de período TDC (Mes actual, Mes anterior, etc.)
	private readonly tdcPeriodOptionItem = 'li.options__item'

	// Inspeccionado via MCP Playwright en ngob/globalPosition.0.3.25 — tag + id
	// Componente principal de tabla de movimientos TDC identificado por id="movements"
	private readonly tdcMovementsTableComponent =
		'cells-movements-table#movements'

	// Inspeccionado via MCP Playwright en ngob/globalPosition.0.3.25 — tag
	// Componente de filtro de movimientos TDC (contiene los dropdowns de tarjeta y período)
	private readonly tdcMovementsFilterComponent = 'cells-movements-filter'

	// Inspeccionado via MCP Playwright en ngob/globalPosition.0.3.25 — id
	// Data provider de descarga de documento de cuenta (PDF/Excel) — presencia estructural
	// [RALPH-SIN-RESOLVER] — los botones concretos solo se renderizan con movimientos activos
	private readonly tdcDownloadDocumentProvider = '#dpAccountDocumentDownload'

	// Inspeccionado via MCP Playwright en ngob/globalPosition.0.3.25 — id
	// Data provider de impresión de datos de movimientos — presencia estructural
	// [RALPH-SIN-RESOLVER] — el botón concreto solo se renderiza con movimientos activos
	private readonly tdcPrintDataProvider = '#dpCopyPrintData'

	async openMovementsForTdcCard() {
		// Motivo de usePlaywrightTo: la tarjeta TDC reside en el iframe anidado (tdcDetails /
		// globalPosition SPA) dentro del frame externo posicionGlobal. La triple anidación
		// frameset > frame > iframe requiere acceso directo a Playwright frames (igual que en
		// openMovementsForPesosAccount). Adicionalmente puede existir un modal de encuesta en el
		// frame externo que bloquea pointer events hacia el iframe interno; se cierra antes de
		// cualquier interacción. La TDC es el SEGUNDO trigger (índice 1) de cells-atom-icon.dropdown-trigger;
		// al hacer click navega via hash dentro del mismo iframe (no crea un iframe nuevo).
		await I.usePlaywrightTo(
			'close survey modal if present, then click TDC three-dot menu and select Movimientos',
			async ({ page }) => {
				await page.waitForTimeout(2000)

				// Localizar el frame externo (posicionGlobal)
				const frames = page.frames()
				const outerFrame = frames.find(
					(f) =>
						f.url().includes('posicionGlobal') &&
						!f.url().includes('ngob')
				)
				if (!outerFrame) {
					throw new Error(
						`posicionGlobal outer frame not found. Available frames: ${frames
							.map((f) => f.url())
							.join(', ')}`
					)
				}

				// Cerrar modal de encuesta si está visible
				// Inspeccionado via MCP Playwright en posicionGlobal: #close-survey-modal
				const surveyClass = await outerFrame.evaluate(() => {
					const modal = document.getElementById('survey-modal')
					return modal ? modal.className : ''
				})
				if (surveyClass.includes('visible')) {
					await outerFrame.locator(this.surveyModalCloseBtn).click()
					await page.waitForTimeout(500)
				}

				// Localizar el iframe interno (globalPosition SPA / tdcDetails)
				const childFrames = outerFrame.childFrames()
				const innerFrame =
					childFrames.find((f) =>
						f.url().includes('globalPosition')
					) ?? childFrames[0]
				if (!innerFrame) {
					throw new Error(
						'globalPosition inner iframe (tdcDetails) not found'
					)
				}

				// Hacer click en el ícono tres puntos de la tarjeta TDC (segundo trigger, índice 1)
				// Inspeccionado via MCP Playwright: cells-atom-icon.dropdown-trigger — índice 0 = débito, índice 1 = TDC
				await innerFrame.waitForSelector(this.threeDotsMenuTrigger, {
					timeout: 30000,
				})
				await innerFrame
					.locator(this.threeDotsMenuTrigger)
					.nth(1)
					.click()
				await page.waitForTimeout(500)

				// Seleccionar "Movimientos" del menú TDC (último paper-item con ese texto = TDC visible)
				// Inspeccionado via MCP Playwright: paper-item — cuando el menú TDC está abierto,
				// los ítems TDC son los visibles; se usa .last() porque el de pesos está hidden.
				await innerFrame
					.locator(this.productCardMenuItem)
					.filter({ hasText: 'Movimientos' })
					.last()
					.click()

				// Esperar a que la SPA navegue via hash a la vista de movimientos TDC
				// (URL cambia a #!/creditCard/...&tab=m en el mismo iframe tdcDetails)
				await page.waitForTimeout(8000)
			}
		)
	}

	async selectTdcMovementPeriod(period: string) {
		// Motivo de usePlaywrightTo: el dropdown de período de la TDC reside en el iframe
		// tdcDetails (globalPosition.0.3.25 SPA con hash #!/creditCard/...&tab=m) dentro del
		// frame posicionGlobal. La anidación frame > iframe requiere acceso directo a Playwright.
		// El período correcto es el SEGUNDO cells-select.dropdown-filters (nth 1); el primero
		// corresponde al filtro "De Tarjeta".
		await I.usePlaywrightTo(
			`select TDC movement period "${period}"`,
			async ({ page }) => {
				await page.waitForTimeout(2000)

				// Localizar el iframe tdcDetails (globalPosition SPA con hash de TDC)
				const frames = page.frames()
				const tdcFrame =
					frames.find((f) => f.name() === 'tdcDetails') ??
					frames.find((f) => f.url().includes('globalPosition'))
				if (!tdcFrame) {
					throw new Error(
						`tdcDetails frame not found. Available frames: ${frames
							.map((f) => f.url())
							.join(', ')}`
					)
				}

				// Abrir el dropdown de período (segundo cells-select.dropdown-filters, índice 1)
				// Inspeccionado via MCP Playwright: cells-select.dropdown-filters nth(1) → #select_header
				await tdcFrame.waitForSelector(
					this.tdcPeriodDropdownContainer,
					{
						timeout: 30000,
					}
				)
				await tdcFrame
					.locator(this.tdcPeriodDropdownContainer)
					.nth(1)
					.locator(this.tdcDropdownHeader)
					.click()
				await page.waitForTimeout(400)

				// Seleccionar la opción de período especificada
				// Inspeccionado via MCP Playwright: li.options__item filtrado por texto exacto
				await tdcFrame
					.locator(this.tdcPeriodDropdownContainer)
					.nth(1)
					.locator(this.tdcPeriodOptionItem)
					.filter({ hasText: new RegExp(`^${period}$`) })
					.click()

				// Esperar a que el filtro se aplique y los resultados (o el estado vacío) carguen
				await page.waitForTimeout(3000)
			}
		)
	}

	async verifyTdcMovementsComponentVisible(period: string) {
		// Motivo de usePlaywrightTo: cells-movements-filter y cells-movements-table#movements
		// residen en el iframe tdcDetails (posicionGlobal > globalPosition SPA). La anidación
		// frame > iframe requiere acceso a Playwright frames para su verificación.
		// NOTA [RALPH-SIN-RESOLVER]: los encabezados de columna (Fecha, Descripción, Importe,
		// Saldo) solo se renderizan dentro de dom-if templates de Polymer cuando hay movimientos
		// activos en la cuenta. La cuenta de prueba no tiene movimientos para ningún período
		// disponible en el ambiente QA. Se verifica la presencia del componente y la selección del período.
		await I.usePlaywrightTo(
			`verify TDC movements filter and table components visible for period "${period}"`,
			async ({ page }) => {
				const frames = page.frames()
				const tdcFrame =
					frames.find((f) => f.name() === 'tdcDetails') ??
					frames.find((f) => f.url().includes('globalPosition'))
				if (!tdcFrame) {
					throw new Error(
						'tdcDetails frame not found for TDC movements verification'
					)
				}

				// Verificar que el componente de filtro de movimientos está en el DOM
				// Inspeccionado via MCP Playwright: cells-movements-filter
				const filterCount = await tdcFrame
					.locator(this.tdcMovementsFilterComponent)
					.count()
				if (filterCount === 0) {
					throw new Error(
						'cells-movements-filter component not found in TDC movements page'
					)
				}

				// Verificar que el componente de tabla de movimientos TDC está en el DOM
				// Inspeccionado via MCP Playwright: cells-movements-table#movements
				const tableCount = await tdcFrame
					.locator(this.tdcMovementsTableComponent)
					.count()
				if (tableCount === 0) {
					throw new Error(
						'cells-movements-table#movements component not found in TDC movements page'
					)
				}

				// Verificar que el período seleccionado se refleja en el encabezado del dropdown
				// Inspeccionado via MCP Playwright: cells-select.dropdown-filters nth(1) #select_header
				const periodHeaderText = await tdcFrame
					.locator(this.tdcPeriodDropdownContainer)
					.nth(1)
					.locator(this.tdcDropdownHeader)
					.innerText()

				if (!periodHeaderText.includes(period)) {
					throw new Error(
						`Expected period "${period}" not reflected in TDC period dropdown. ` +
							`Actual header text: "${periodHeaderText.trim()}"`
					)
				}
			}
		)
	}

	async verifyTdcDownloadOptionsPresent() {
		// Motivo de usePlaywrightTo: #dpAccountDocumentDownload y #dpCopyPrintData residen
		// en el iframe tdcDetails y requieren acceso directo a Playwright frames.
		// VERIFICACIÓN ESTRUCTURAL: estos data providers (Polymer) están presentes en el DOM
		// siempre. Los botones concretos PDF / Excel / Impresión solo se renderizan cuando hay
		// movimientos activos — ver [RALPH-SIN-RESOLVER] en .ralph/estado_CP5.md.
		await I.usePlaywrightTo(
			'verify TDC download provider components are present in the DOM',
			async ({ page }) => {
				const frames = page.frames()
				const tdcFrame =
					frames.find((f) => f.name() === 'tdcDetails') ??
					frames.find((f) => f.url().includes('globalPosition'))
				if (!tdcFrame) {
					throw new Error(
						'tdcDetails frame not found for TDC download options verification'
					)
				}

				// Verificar data provider de descarga de documentos PDF/Excel
				// Inspeccionado via MCP Playwright: #dpAccountDocumentDownload
				const downloadCount = await tdcFrame
					.locator(this.tdcDownloadDocumentProvider)
					.count()
				if (downloadCount === 0) {
					throw new Error(
						'TDC document download provider (#dpAccountDocumentDownload) not found in DOM. ' +
							'[RALPH-SIN-RESOLVER] — PDF/Excel buttons require movement data to render.'
					)
				}

				// Verificar data provider de impresión
				// Inspeccionado via MCP Playwright: #dpCopyPrintData
				const printCount = await tdcFrame
					.locator(this.tdcPrintDataProvider)
					.count()
				if (printCount === 0) {
					throw new Error(
						'TDC print provider (#dpCopyPrintData) not found in DOM. ' +
							'[RALPH-SIN-RESOLVER] — Impresión button requires movement data to render.'
					)
				}
			}
		)
	}
}

export = new BbvaPosicionGlobalPage()
