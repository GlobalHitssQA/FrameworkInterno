// Page Object: BBVA Posición Global
// Inspeccionado via MCP Playwright en https://test.bbvanet.com.mx/andrea/mxdydni/login
// (sesión autenticada — frameset con iframe interno ngob/globalPosition)

const { I } = inject()

class PosicionGlobalPage {
	// ── Inner iframe URL fragment ─────────────────────────────────────────────────
	// Inspeccionado via MCP Playwright — el iframe interno que contiene la SPA de productos
	// src contiene este fragmento: ngob/globalPosition.0.3.25/index.html
	private readonly innerFrameUrlFragment = 'ngob/globalPosition'

	// ── "Imprimir saldos" button ──────────────────────────────────────────────────
	// Inspeccionado via MCP Playwright en iframe#tdcDetails (ngob/globalPosition)
	// El componente cells-products-paginator contiene DOS span.toggle_button:
	//   1. El primero (.side_section SIN .toogle_container) = "Imprimir saldos" (ícono impresora)
	//   2. El segundo (.side_section CON .toogle_container)  = "Mostrar todas (N)"
	// Al hacer clic en el primero, se inicia automáticamente la descarga del PDF.
	// Selector CSS confirmado: cells-products-paginator span.toggle_button (primer match)
	// Selector más específico: cells-products-paginator .side_section:not(.toogle_container) .toggle_button
	private printBalancesButton =
		'cells-products-paginator .side_section:not(.toogle_container) .toggle_button'

	// ── Posición Global displayed verification ────────────────────────────────────
	// Inspeccionado via MCP Playwright — texto visible en el iframe externo (posicionGlobal)
	// tras login exitoso: el nombre del cliente aparece en el header del frame externo
	private readonly outerFrameUrlFragment = 'mxdydni/posicionGlobal'

	async verifyGlobalPositionIsDisplayed() {
		await I.usePlaywrightTo(
			'verify the global position page is displayed in the outer frame',
			async ({ page }) => {
				const outerUrlFragment = this.outerFrameUrlFragment
				const waitForOuterFrame = async (
					retries = 30
				): Promise<any> => {
					const frame = page
						.frames()
						.find((f) => f.url().includes(outerUrlFragment))
					if (frame) return frame
					if (retries <= 0)
						throw new Error('Outer posicionGlobal frame not found')
					await page.waitForTimeout(2000)
					return waitForOuterFrame(retries - 1)
				}
				await waitForOuterFrame()
			}
		)
	}

	// ── "Imprimir saldos" — click and capture PDF download ───────────────────────

	async clickPrintBalancesButton() {
		const selector = this.printBalancesButton
		const innerUrlFragment = this.innerFrameUrlFragment
		await I.usePlaywrightTo(
			'click the Imprimir saldos button and capture the PDF download event',
			async ({ page }) => {
				// Navigate to the inner iframe (ngob/globalPosition) that hosts the product cards
				const waitForInnerFrame = async (
					retries = 20
				): Promise<any> => {
					const frame = page
						.frames()
						.find((f) => f.url().includes(innerUrlFragment))
					if (frame) return frame
					if (retries <= 0)
						throw new Error('Inner globalPosition frame not found')
					await page.waitForTimeout(1500)
					return waitForInnerFrame(retries - 1)
				}
				const innerFrame = await waitForInnerFrame()
				await innerFrame.waitForSelector(selector, { timeout: 30000 })

				// Set up download listener before clicking to ensure it is captured
				const [download] = await Promise.all([
					page.waitForEvent('download', { timeout: 30000 }),
					innerFrame.click(selector),
				])

				// Store the download reference for verification in the Then step
				;(page as any).__lastDownload = download
			}
		)
	}

	// ── Debit account visibility (CP1) ───────────────────────────────────────────
	// Inspeccionado via MCP Playwright en iframe ngob/globalPosition.0.3.25/index.html
	// El elemento span.title.style-scope.cells-widget-product-card muestra "Cuenta de débito • XXXXX"
	// (equivalente a "Cuenta en Pesos" en la descripción del caso de prueba)

	async verifyDebitAccountVisible() {
		const innerUrlFragment = this.innerFrameUrlFragment
		await I.usePlaywrightTo(
			'verify the debit account (Cuenta de débito) is visible in the global position SPA',
			async ({ page }) => {
				const waitForInnerFrame = async (
					retries = 20
				): Promise<any> => {
					const frame = page
						.frames()
						.find((f) => f.url().includes(innerUrlFragment))
					if (frame) return frame
					if (retries <= 0)
						throw new Error('Inner globalPosition frame not found')
					await page.waitForTimeout(1500)
					return waitForInnerFrame(retries - 1)
				}
				const innerFrame = await waitForInnerFrame()
				// Selector confirmado: span.title.style-scope.cells-widget-product-card con texto "Cuenta de débito"
				await innerFrame
					.locator('text=Cuenta de débito')
					.first()
					.waitFor({ timeout: 30000 })
			}
		)
	}

	// ── Credit card visibility (CP1) ──────────────────────────────────────────────
	// Inspeccionado via MCP Playwright en iframe ngob/globalPosition.0.3.25/index.html
	// El elemento span.title.style-scope.cells-widget-product-card muestra "Tarjeta de crédito • XXXXX"

	async verifyCreditCardVisible() {
		const innerUrlFragment = this.innerFrameUrlFragment
		await I.usePlaywrightTo(
			'verify the credit card (Tarjeta de crédito) is visible in the global position SPA',
			async ({ page }) => {
				const waitForInnerFrame = async (
					retries = 20
				): Promise<any> => {
					const frame = page
						.frames()
						.find((f) => f.url().includes(innerUrlFragment))
					if (frame) return frame
					if (retries <= 0)
						throw new Error('Inner globalPosition frame not found')
					await page.waitForTimeout(1500)
					return waitForInnerFrame(retries - 1)
				}
				const innerFrame = await waitForInnerFrame()
				// Selector confirmado: span.title.style-scope.cells-widget-product-card con texto "Tarjeta de crédito"
				await innerFrame
					.locator('text=Tarjeta de crédito')
					.first()
					.waitFor({ timeout: 30000 })
			}
		)
	}

	// ── PDF download verification ─────────────────────────────────────────────────

	// ── Movements frame URL fragment ──────────────────────────────────────────────
	// Inspeccionado via MCP Playwright en https://test.bbvanet.com.mx/andrea/mxdydni/posicionGlobalNgob
	// Tras hacer clic en "Movimientos", el outer frame cambia a posicionGlobalNgob y el
	// iframe interno (id="genericFrameCells") carga una URL que contiene este fragmento.
	private readonly movementsFrameUrlFragment = 'ngob/movements'

	// ── Open three-dot menu on the debit account card (CP3) ───────────────────────
	// Inspeccionado via MCP Playwright en iframe#tdcDetails (ngob/globalPosition)
	// cells-menu-options:first-of-type contiene el #trigger (ícono coronita:more) de la
	// primera tarjeta (Cuenta de débito — cuenta en pesos).
	async openThreeDotsMenuOnDebitCard() {
		const innerUrlFragment = this.innerFrameUrlFragment
		await I.usePlaywrightTo(
			'click the three-dot menu trigger on the first debit account card',
			async ({ page }) => {
				const waitForInnerFrame = async (
					retries = 20
				): Promise<any> => {
					const frame = page
						.frames()
						.find((f) => f.url().includes(innerUrlFragment))
					if (frame) return frame
					if (retries <= 0)
						throw new Error('Inner globalPosition frame not found')
					await page.waitForTimeout(1500)
					return waitForInnerFrame(retries - 1)
				}
				const innerFrame = await waitForInnerFrame()
				await innerFrame.evaluate(() => {
					const menuOptions =
						document.querySelectorAll('cells-menu-options')
					if (!menuOptions[0])
						throw new Error(
							'cells-menu-options not found in globalPosition frame'
						)
					const trigger = menuOptions[0].querySelector('#trigger')
					if (!trigger)
						throw new Error(
							'Three-dot trigger (#trigger) not found'
						)
					;(trigger as HTMLElement).dispatchEvent(
						new MouseEvent('click', {
							bubbles: true,
							cancelable: true,
						})
					)
				})
				await page.waitForTimeout(1000)
			}
		)
	}

	// ── Click "Movimientos" from the account card dropdown menu (CP3) ──────────────
	// Inspeccionado via MCP Playwright en iframe#tdcDetails (ngob/globalPosition)
	// paper-item.cells-menu-options-item con texto "Movimientos" = primer ítem del menú.
	// Al hacer clic navega al outer frame posicionGlobalNgob con iframe ngob/movements.
	async clickMovimientosFromCardMenu() {
		const innerUrlFragment = this.innerFrameUrlFragment
		await I.usePlaywrightTo(
			'click Movimientos from the debit account card dropdown menu',
			async ({ page }) => {
				const waitForInnerFrame = async (
					retries = 20
				): Promise<any> => {
					const frame = page
						.frames()
						.find((f) => f.url().includes(innerUrlFragment))
					if (frame) return frame
					if (retries <= 0)
						throw new Error('Inner globalPosition frame not found')
					await page.waitForTimeout(1500)
					return waitForInnerFrame(retries - 1)
				}
				const innerFrame = await waitForInnerFrame()
				await innerFrame.evaluate(() => {
					const items = document.querySelectorAll(
						'paper-item.cells-menu-options-item'
					)
					const movItem = Array.from(items).find(
						(el) => el.textContent?.trim() === 'Movimientos'
					)
					if (!movItem)
						throw new Error(
							'"Movimientos" paper-item not found in globalPosition frame'
						)
					;(movItem as HTMLElement).dispatchEvent(
						new MouseEvent('click', {
							bubbles: true,
							cancelable: true,
						})
					)
				})
				// Wait for navigation to posicionGlobalNgob and movements frame to load
				await page.waitForTimeout(5000)
			}
		)
	}

	// ── Select a period in the movements filter (CP3) ──────────────────────────────
	// Inspeccionado via MCP Playwright en iframe#genericFrameCells (ngob/movements.1.2.1)
	// Shadow DOM path:
	//   check-account-page#cells-template-check-account → shadowRoot
	//   → cells-check-account-movements#caMovements → shadowRoot
	//   → csg-with-calendar#csgCalendar → shadowRoot
	//   → div#toggle  (abre el dropdown de período)
	//   → div.option__label (opciones: "Mes Actual", "Mes Anterior", "Dos meses atrás")
	async selectMovementsPeriod(period: string) {
		const movementsUrlFragment = this.movementsFrameUrlFragment
		await I.usePlaywrightTo(
			`select the period "${period}" in the movements filter dropdown`,
			async ({ page }) => {
				const waitForMovementsFrame = async (
					retries = 20
				): Promise<any> => {
					const frame = page
						.frames()
						.find((f) => f.url().includes(movementsUrlFragment))
					if (frame) return frame
					if (retries <= 0)
						throw new Error(
							'Movements frame (ngob/movements) not found'
						)
					await page.waitForTimeout(1500)
					return waitForMovementsFrame(retries - 1)
				}
				const movementsFrame = await waitForMovementsFrame()

				// Click the period toggle to open the dropdown
				await movementsFrame.evaluate(() => {
					const checkPage = document.getElementById(
						'cells-template-check-account'
					)
					const caMovements = (
						checkPage as any
					)?.shadowRoot?.querySelector(
						'cells-check-account-movements#caMovements'
					)
					const csgCalendar = (
						caMovements as any
					)?.shadowRoot?.querySelector(
						'csg-with-calendar#csgCalendar'
					)
					const toggle = (
						csgCalendar as any
					)?.shadowRoot?.querySelector('#toggle')
					if (!toggle)
						throw new Error(
							'Period toggle (#toggle) not found in csgCalendar shadow root'
						)
					;(toggle as HTMLElement).dispatchEvent(
						new MouseEvent('click', {
							bubbles: true,
							cancelable: true,
						})
					)
				})

				await page.waitForTimeout(800)

				// Click the option label matching the target period
				await movementsFrame.evaluate((targetPeriod: string) => {
					const checkPage = document.getElementById(
						'cells-template-check-account'
					)
					const caMovements = (
						checkPage as any
					)?.shadowRoot?.querySelector(
						'cells-check-account-movements#caMovements'
					)
					const csgCalendar = (
						caMovements as any
					)?.shadowRoot?.querySelector(
						'csg-with-calendar#csgCalendar'
					)
					const s3 = (csgCalendar as any)?.shadowRoot
					if (!s3)
						throw new Error(
							'csgCalendar shadow root not accessible'
						)
					const optionLabels = Array.from(
						s3.querySelectorAll('div.option__label')
					)
					const targetOption = optionLabels.find(
						(el: any) => el.textContent?.trim() === targetPeriod
					)
					if (!targetOption)
						throw new Error(
							`Period option "${targetPeriod}" not found in dropdown`
						)
					;(targetOption as HTMLElement).dispatchEvent(
						new MouseEvent('click', {
							bubbles: true,
							cancelable: true,
						})
					)
				}, period)

				// Wait for the movements list to reload after period selection
				await page.waitForTimeout(3000)
			}
		)
	}

	// ── Verify movements table columns visible (CP3) ───────────────────────────────
	// Inspeccionado via MCP Playwright en iframe#genericFrameCells (ngob/movements.1.2.1)
	// Shadow DOM path:
	//   check-account-page#cells-template-check-account → shadowRoot
	//   → cells-check-account-movements#caMovements → shadowRoot
	//   → cells-th: FECHA, DESCRIPCIÓN, MONTO, SALDO TOTAL
	async verifyMovementsTableColumnsVisible() {
		const movementsUrlFragment = this.movementsFrameUrlFragment
		await I.usePlaywrightTo(
			'verify the movements table displays FECHA, DESCRIPCIÓN, MONTO and SALDO TOTAL columns',
			async ({ page }) => {
				const waitForMovementsFrame = async (
					retries = 20
				): Promise<any> => {
					const frame = page
						.frames()
						.find((f) => f.url().includes(movementsUrlFragment))
					if (frame) return frame
					if (retries <= 0)
						throw new Error(
							'Movements frame (ngob/movements) not found'
						)
					await page.waitForTimeout(1500)
					return waitForMovementsFrame(retries - 1)
				}
				const movementsFrame = await waitForMovementsFrame()

				const missingHeaders = await movementsFrame.evaluate(() => {
					const checkPage = document.getElementById(
						'cells-template-check-account'
					)
					const caMovements = (
						checkPage as any
					)?.shadowRoot?.querySelector(
						'cells-check-account-movements#caMovements'
					)
					if (!(caMovements as any)?.shadowRoot)
						return [
							'cells-check-account-movements#caMovements shadow root not accessible',
						]
					const expectedHeaders = [
						'FECHA',
						'DESCRIPCIÓN',
						'MONTO',
						'SALDO TOTAL',
					]
					const allHeaderTexts = Array.from(
						(caMovements as any).shadowRoot.querySelectorAll(
							'cells-th'
						)
					).map((th: any) => th.textContent?.trim())
					return expectedHeaders.filter(
						(h) => !allHeaderTexts.includes(h)
					)
				})

				if (missingHeaders.length > 0) {
					throw new Error(
						`Movements table is missing expected columns: ${missingHeaders.join(
							', '
						)}`
					)
				}
			}
		)
	}

	// ── Verify download options visible (CP3) ──────────────────────────────────────
	// Inspeccionado via MCP Playwright en iframe#genericFrameCells (ngob/movements.1.2.1)
	// Shadow DOM path:
	//   check-account-page#cells-template-check-account → shadowRoot
	//   → cells-check-account-statements → shadowRoot
	//   → cells-th: DESCARGA PDF, DESCARGA XML
	// Nota: El UI muestra DESCARGA PDF y DESCARGA XML (el caso de prueba menciona PDF,
	// Excel e Impresión — la plataforma implementa PDF y XML como formatos de descarga).
	async verifyMovementsDownloadOptionsVisible() {
		const movementsUrlFragment = this.movementsFrameUrlFragment
		await I.usePlaywrightTo(
			'verify DESCARGA PDF and DESCARGA XML download options are available in the movements page',
			async ({ page }) => {
				const waitForMovementsFrame = async (
					retries = 20
				): Promise<any> => {
					const frame = page
						.frames()
						.find((f) => f.url().includes(movementsUrlFragment))
					if (frame) return frame
					if (retries <= 0)
						throw new Error(
							'Movements frame (ngob/movements) not found'
						)
					await page.waitForTimeout(1500)
					return waitForMovementsFrame(retries - 1)
				}
				const movementsFrame = await waitForMovementsFrame()

				const missingOptions = await movementsFrame.evaluate(() => {
					const checkPage = document.getElementById(
						'cells-template-check-account'
					)
					const s1 = (checkPage as any)?.shadowRoot
					if (!s1)
						return ['check-account-page shadow root not accessible']
					const statementsEl = s1.querySelector(
						'cells-check-account-statements'
					)
					if (!(statementsEl as any)?.shadowRoot)
						return [
							'cells-check-account-statements shadow root not accessible',
						]
					const expectedOptions = ['DESCARGA PDF', 'DESCARGA XML']
					const allHeaderTexts = Array.from(
						(statementsEl as any).shadowRoot.querySelectorAll(
							'cells-th'
						)
					).map((th: any) => th.textContent?.trim())
					return expectedOptions.filter(
						(o) => !allHeaderTexts.includes(o)
					)
				})

				if (missingOptions.length > 0) {
					throw new Error(
						`Missing download options on movements page: ${missingOptions.join(
							', '
						)}`
					)
				}
			}
		)
	}

	// ── Verify movements export options visible (CP4) ─────────────────────────────
	// Inspeccionado via MCP Playwright en iframe#genericFrameCells (ngob/movements.1.2.1)
	// Shadow DOM path:
	//   check-account-page#cells-template-check-account → shadowRoot
	//   → cells-check-account-movements#caMovements → shadowRoot
	//   → div.export-options-container (visible only when _shouldExportOptionsBeVisible=true,
	//     i.e. when at least one movement exists in the selected period)
	//     → cells-st-button.export-icon   iron-icon[icon="coronita:print"] — "Imprimir"
	//     → cells-st-button               iron-icon[icon="coronita:pdf"]   — "PDF"
	//     → cells-st-button               iron-icon[icon="coronita:excel"] — "Excel"
	// Confirmed via MCP Playwright evaluate on posicionGlobalNgob → ngob/movements.1.2.1
	async verifyMovementsExportOptionsVisible() {
		const movementsUrlFragment = this.movementsFrameUrlFragment
		await I.usePlaywrightTo(
			'verify that PDF, Excel and Print (Imprimir) export buttons are visible in the movements page',
			async ({ page }) => {
				const waitForMovementsFrame = async (
					retries = 20
				): Promise<any> => {
					const frame = page
						.frames()
						.find((f) => f.url().includes(movementsUrlFragment))
					if (frame) return frame
					if (retries <= 0)
						throw new Error(
							'Movements frame (ngob/movements) not found'
						)
					await page.waitForTimeout(1500)
					return waitForMovementsFrame(retries - 1)
				}
				const movementsFrame = await waitForMovementsFrame()

				const missingIcons = await movementsFrame.evaluate(() => {
					const checkPage = document.getElementById(
						'cells-template-check-account'
					)
					const s1 = checkPage?.shadowRoot
					if (!s1)
						return ['check-account-page shadow root not accessible']
					const movComp = s1.querySelector(
						'cells-check-account-movements#caMovements'
					)
					const mSr = (movComp as any)?.shadowRoot
					if (!mSr) return ['caMovements shadow root not accessible']
					const exportContainer = mSr.querySelector(
						'.export-options-container'
					)
					if (!exportContainer)
						return ['export-options-container not found']

					// coronita:print → Imprimir button
					// coronita:pdf   → PDF download button
					// coronita:excel → Excel download button
					const expectedIcons = [
						'coronita:print',
						'coronita:pdf',
						'coronita:excel',
					]
					const foundIcons = Array.from(
						exportContainer.querySelectorAll('iron-icon')
					).map((el: any) => el.getAttribute('icon'))

					return expectedIcons.filter(
						(icon) => !foundIcons.includes(icon)
					)
				})

				if (missingIcons.length > 0) {
					throw new Error(
						`Movements export options are missing: ${missingIcons.join(
							', '
						)}. ` +
							'Ensure a period with movements data was selected before checking export options.'
					)
				}
			}
		)
	}

	// ── CP5: Open three-dot menu on the TDC (credit card) card ───────────────────
	// Inspeccionado via MCP Playwright en iframe ngob/globalPosition.0.3.25/index.html
	// cells-menu-options elements: index 0 = Cuenta de débito, index 1 = Tarjeta de crédito
	// El #trigger del segundo cells-menu-options (index 1) abre el menú de la TDC.
	// Confirmado via evaluate: allMenuOptions[1].querySelector('#trigger')
	async openThreeDotsMenuOnCreditCard() {
		const innerUrlFragment = this.innerFrameUrlFragment
		await I.usePlaywrightTo(
			'click the three-dot menu trigger on the credit card (TDC) card',
			async ({ page }) => {
				const waitForInnerFrame = async (
					retries = 20
				): Promise<any> => {
					const frame = page
						.frames()
						.find((f) => f.url().includes(innerUrlFragment))
					if (frame) return frame
					if (retries <= 0)
						throw new Error('Inner globalPosition frame not found')
					await page.waitForTimeout(1500)
					return waitForInnerFrame(retries - 1)
				}
				const innerFrame = await waitForInnerFrame()
				await innerFrame.evaluate(() => {
					const menuOptions =
						document.querySelectorAll('cells-menu-options')
					if (!menuOptions[1])
						throw new Error(
							'Second cells-menu-options (TDC) not found in globalPosition frame'
						)
					const trigger = menuOptions[1].querySelector('#trigger')
					if (!trigger)
						throw new Error(
							'Three-dot trigger (#trigger) not found on TDC card'
						)
					;(trigger as HTMLElement).dispatchEvent(
						new MouseEvent('click', {
							bubbles: true,
							cancelable: true,
						})
					)
				})
				await page.waitForTimeout(1000)
			}
		)
	}

	// ── CP5: Click "Movimientos" from the TDC card dropdown menu ─────────────────
	// Inspeccionado via MCP Playwright en iframe ngob/globalPosition.0.3.25/index.html
	// A diferencia de la cuenta de débito, el TDC NO navega a un frame ngob/movements.
	// La navegación ocurre dentro del mismo inner globalPosition frame cambiando la ruta hash
	// a #!/creditCard/TCMXP0000001?accountType=TDC&tab=m
	// Confirmado via evaluate: allMenuOptions[1].querySelectorAll('paper-item.cells-menu-options-item')[0]
	async clickMovimientosFromCreditCardMenu() {
		const innerUrlFragment = this.innerFrameUrlFragment
		await I.usePlaywrightTo(
			'click Movimientos from the TDC credit card dropdown menu and wait for creditCard route to load',
			async ({ page }) => {
				const waitForInnerFrame = async (
					retries = 20
				): Promise<any> => {
					const frame = page
						.frames()
						.find((f) => f.url().includes(innerUrlFragment))
					if (frame) return frame
					if (retries <= 0)
						throw new Error('Inner globalPosition frame not found')
					await page.waitForTimeout(1500)
					return waitForInnerFrame(retries - 1)
				}
				const innerFrame = await waitForInnerFrame()
				await innerFrame.evaluate(() => {
					const menuOptions =
						document.querySelectorAll('cells-menu-options')
					if (!menuOptions[1])
						throw new Error(
							'Second cells-menu-options (TDC) not found'
						)
					const items = menuOptions[1].querySelectorAll(
						'paper-item.cells-menu-options-item'
					)
					const movItem = Array.from(items).find(
						(el) => el.textContent?.trim() === 'Movimientos'
					)
					if (!movItem)
						throw new Error(
							'"Movimientos" paper-item not found in TDC card menu'
						)
					;(movItem as HTMLElement).dispatchEvent(
						new MouseEvent('click', {
							bubbles: true,
							cancelable: true,
						})
					)
				})
				// Wait for the inner frame hash to change to #!/creditCard/ and page to render
				await page.waitForTimeout(5000)
			}
		)
	}

	// ── CP5: Select period in TDC movements filter ────────────────────────────────
	// Inspeccionado via MCP Playwright en iframe ngob/globalPosition (ruta #!/creditCard/)
	// El TDC usa cells-movements-filter > cells-select#idInputSelectCalendar para el período.
	// Opciones disponibles: Mes actual, Mes anterior, Dos meses atrás, Tres meses atrás,
	// Cuatro meses atrás, Cinco meses atrás.
	// El botón de aplicar filtro es: .cells-movements-filter-btn dentro de cells-movements-filter.
	// Confirmado via evaluate en cells-template-ng-tdc-ch#cells-template-creditCard.
	async selectTDCMovementsPeriod(period: string) {
		const innerUrlFragment = this.innerFrameUrlFragment
		await I.usePlaywrightTo(
			`select TDC movements period "${period}" using cells-select#idInputSelectCalendar`,
			async ({ page }) => {
				const waitForInnerFrame = async (
					retries = 20
				): Promise<any> => {
					const frame = page
						.frames()
						.find((f) => f.url().includes(innerUrlFragment))
					if (frame) return frame
					if (retries <= 0)
						throw new Error('Inner globalPosition frame not found')
					await page.waitForTimeout(1500)
					return waitForInnerFrame(retries - 1)
				}
				const innerFrame = await waitForInnerFrame()

				// Open filter panel (toggle to expand if collapsed)
				await innerFrame.evaluate(() => {
					const tdcTemplate = document.getElementById(
						'cells-template-creditCard'
					)
					const movFilter = tdcTemplate?.querySelector(
						'cells-movements-filter'
					)
					const toggleBtn = movFilter?.querySelector(
						'.cells-movements-filter-toggle-filters-button'
					)
					if (toggleBtn);
					;(toggleBtn as HTMLElement).click()
				})
				await page.waitForTimeout(500)

				// Open the period dropdown
				await innerFrame.evaluate(() => {
					const tdcTemplate = document.getElementById(
						'cells-template-creditCard'
					)
					const movFilter = tdcTemplate?.querySelector(
						'cells-movements-filter'
					)
					const calSel = movFilter?.querySelector(
						'#idInputSelectCalendar'
					)
					const header = calSel?.querySelector('#select_header')
					if (!header)
						throw new Error(
							'Period select header not found in TDC movements filter'
						)
					;(header as HTMLElement).click()
				})
				await page.waitForTimeout(500)

				// Click the matching period option
				await innerFrame.evaluate((targetPeriod: string) => {
					const tdcTemplate = document.getElementById(
						'cells-template-creditCard'
					)
					const movFilter = tdcTemplate?.querySelector(
						'cells-movements-filter'
					)
					const calSel = movFilter?.querySelector(
						'#idInputSelectCalendar'
					)
					const options = calSel?.querySelectorAll('li.options__item')
					const target = Array.from(options || []).find(
						(o) => o.textContent?.trim() === targetPeriod
					)
					if (!target)
						throw new Error(
							`Period option "${targetPeriod}" not found in TDC calendar select`
						)
					;(target as HTMLElement).click()
				}, period)
				await page.waitForTimeout(500)

				// Apply the filter
				await innerFrame.evaluate(() => {
					const tdcTemplate = document.getElementById(
						'cells-template-creditCard'
					)
					const movFilter = tdcTemplate?.querySelector(
						'cells-movements-filter'
					)
					const applyBtn = movFilter?.querySelector(
						'.cells-movements-filter-btn'
					)
					if (!applyBtn)
						throw new Error(
							'Apply filter button (.cells-movements-filter-btn) not found'
						)
					;(applyBtn as HTMLElement).click()
				})
				// Wait for movements to reload
				await page.waitForTimeout(3000)
			}
		)
	}

	// ── CP5: Verify TDC movements column structure ────────────────────────────────
	// Inspeccionado via MCP Playwright en iframe ngob/globalPosition (ruta #!/creditCard/)
	// cells-movements-table#movements.__data__.movements.cols contiene siempre las columnas:
	//   date (Fecha), description (Descripción), amount (Importe), balance (Saldo)
	// Esta verificación valida la configuración del componente independientemente de si
	// hay datos cargados (los headers cells-th solo se renderizan cuando hay items).
	// Confirmado via evaluate: movTable.__data__.movements.cols[*].key
	async verifyTDCMovementsColumnsConfigured() {
		const innerUrlFragment = this.innerFrameUrlFragment
		await I.usePlaywrightTo(
			'verify TDC movements table is configured with Fecha, Descripción, Importe and Saldo columns',
			async ({ page }) => {
				const waitForInnerFrame = async (
					retries = 20
				): Promise<any> => {
					const frame = page
						.frames()
						.find((f) => f.url().includes(innerUrlFragment))
					if (frame) return frame
					if (retries <= 0)
						throw new Error('Inner globalPosition frame not found')
					await page.waitForTimeout(1500)
					return waitForInnerFrame(retries - 1)
				}
				const innerFrame = await waitForInnerFrame()

				const missingCols = await innerFrame.evaluate(() => {
					const tdcTemplate = document.getElementById(
						'cells-template-creditCard'
					)
					const movTable = tdcTemplate?.querySelector(
						'cells-movements-table#movements'
					)
					if (!movTable)
						return [
							'cells-movements-table#movements not found in cells-template-creditCard',
						]
					const data = (movTable as any).__data__
					const cols: Array<{ key: string }> =
						data?.movements?.cols || []
					// Expected column keys: date (Fecha), description (Descripción),
					// amount (Importe), balance (Saldo)
					const expectedKeys = [
						'date',
						'description',
						'amount',
						'balance',
					]
					return expectedKeys.filter(
						(k) => !cols.some((c) => c.key === k)
					)
				})

				if (missingCols.length > 0) {
					throw new Error(
						`TDC movements table is missing expected column keys: ${missingCols.join(
							', '
						)}. ` +
							'Expected columns: Fecha (date), Descripción (description), Importe (amount), Saldo (balance).'
					)
				}
			}
		)
	}

	// ── CP5: Verify TDC movements export options ──────────────────────────────────
	// Inspeccionado via MCP Playwright en iframe ngob/globalPosition (ruta #!/creditCard/)
	// cells-movements-table#movements.__data__.movements.properties.print contiene:
	//   { type: "html", description: "Imprimir", icon: "coronita:print" }
	//   { type: "pdf",  description: "PDF",      icon: "coronita:pdf"   }
	//   { type: "xls",  description: "Excel",    icon: "coronita:excel" }
	// Esta verificación valida la configuración del componente (print array).
	// Confirmado via evaluate: movTable.__data__.movements.properties.print
	async verifyTDCMovementsExportOptionsConfigured() {
		const innerUrlFragment = this.innerFrameUrlFragment
		await I.usePlaywrightTo(
			'verify TDC movements export options include PDF, Excel and Print (Imprimir)',
			async ({ page }) => {
				const waitForInnerFrame = async (
					retries = 20
				): Promise<any> => {
					const frame = page
						.frames()
						.find((f) => f.url().includes(innerUrlFragment))
					if (frame) return frame
					if (retries <= 0)
						throw new Error('Inner globalPosition frame not found')
					await page.waitForTimeout(1500)
					return waitForInnerFrame(retries - 1)
				}
				const innerFrame = await waitForInnerFrame()

				const missingOptions = await innerFrame.evaluate(() => {
					const tdcTemplate = document.getElementById(
						'cells-template-creditCard'
					)
					const movTable = tdcTemplate?.querySelector(
						'cells-movements-table#movements'
					)
					if (!movTable)
						return [
							'cells-movements-table#movements not found in cells-template-creditCard',
						]
					const data = (movTable as any).__data__
					const printOpts: Array<{ type: string }> =
						data?.movements?.properties?.print || []
					// Expected types: html (Imprimir), pdf (PDF), xls (Excel)
					const expectedTypes = ['html', 'pdf', 'xls']
					return expectedTypes.filter(
						(t) => !printOpts.some((o) => o.type === t)
					)
				})

				if (missingOptions.length > 0) {
					throw new Error(
						`TDC movements export options are missing: ${missingOptions.join(
							', '
						)}. ` +
							'Expected: html (Imprimir), pdf (PDF), xls (Excel).'
					)
				}
			}
		)
	}

	async verifyGlobalPositionPdfDownloaded() {
		await I.usePlaywrightTo(
			'verify that a PDF file with global position balance details was downloaded',
			async ({ page }) => {
				const download = (page as any).__lastDownload
				if (!download) {
					throw new Error(
						'No download was captured after clicking "Imprimir saldos". ' +
							'Ensure clickPrintBalancesButton() was called first.'
					)
				}
				const filename = download.suggestedFilename()
				if (!filename.toLowerCase().endsWith('.pdf')) {
					throw new Error(
						`Expected a PDF download but received: "${filename}". ` +
							'The downloaded file should be in PDF format.'
					)
				}
			}
		)
	}
}

export = new PosicionGlobalPage()
