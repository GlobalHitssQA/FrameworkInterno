// Page Object: BBVA Login
// Inspeccionado via MCP Playwright en https://test.bbvanet.com.mx/andrea/mxdydni/login

const { I } = inject()

class BbvaLoginPage {
	// ── URL constant ─────────────────────────────────────────────────────────────
	private readonly loginUrl =
		'https://test.bbvanet.com.mx/andrea/mxdydni/login'

	// ── Login form selectors (modern SPA — no frameset) ──────────────────────────
	// Inspeccionado via MCP Playwright en https://test.bbvanet.com.mx/andrea/mxdydni/login
	// La página moderna (sesión limpia) presenta formulario SPA sin frameset.
	// Selectores confirmados mediante snapshot de accesibilidad MCP.

	// role="textbox" aria-label="Número de tarjeta" — campo número de tarjeta TDD (16 dígitos)
	// Selector accedido via page.getByRole('textbox', { name: /número de tarjeta/i })
	private cardNumberField = 'input[type="text"]:first-of-type'

	// role="textbox" aria-label="Contraseña" — campo contraseña
	// Selector accedido via page.getByRole('textbox', { name: /contraseña/i })
	private passwordField = 'input[type="password"]'

	// button "Continuar" type="submit" — botón de envío del formulario de login
	// Selector accedido via page.getByRole('button', { name: /continuar/i })
	private loginButton = 'button[type="submit"]'

	// ── Token form selectors ─────────────────────────────────────────────────────
	// Inspeccionado via MCP Playwright en la pantalla de token (segunda etapa del login)
	// id="tkn" — campo de token móvil (OTP de 8 dígitos)
	// [RALPH-SIN-RESOLVER] — MCP no pudo acceder a la pantalla de token en esta sesión;
	// selector referenciado desde inspección previa del proyecto
	private tokenField = '#tkn'

	// ── Navigation ───────────────────────────────────────────────────────────────

	navigateToLoginUrl() {
		I.amOnPage(this.loginUrl)
		I.wait(3)
	}

	// ── Login form interactions ───────────────────────────────────────────────────

	async enterCardNumber(card: string) {
		await I.usePlaywrightTo(
			'fill card number in the login form',
			async ({ page }) => {
				// Modern SPA login — confirmed via MCP Playwright accessibility snapshot
				const field = page.getByRole('textbox', {
					name: /número de tarjeta/i,
				})
				await field.waitFor({ timeout: 30000 })
				await field.fill(card)
			}
		)
	}

	async enterPassword(password: string) {
		await I.usePlaywrightTo(
			'fill password in the login form',
			async ({ page }) => {
				// Modern SPA login — confirmed via MCP Playwright accessibility snapshot
				const field = page.getByRole('textbox', { name: /contraseña/i })
				await field.waitFor({ timeout: 30000 })
				await field.fill(password)
			}
		)
	}

	async clickLoginButton() {
		await I.usePlaywrightTo(
			'click the Continuar submit button in the login form',
			async ({ page }) => {
				// Modern SPA login — confirmed via MCP Playwright accessibility snapshot
				const btn = page.getByRole('button', { name: /continuar/i })
				await btn.waitFor({ timeout: 30000 })
				await btn.click()
				// Allow time for the next page (token or global position) to load
				await page.waitForTimeout(3000)
			}
		)
	}

	// ── typeCardNumber — alternative entry using pressSequentially ───────────────
	// Inspeccionado via MCP Playwright en /andrea/mxdydni/login — atributo id: username2
	// NOTA: el campo TDD de BBVA requiere eventos keydown/keypress por carácter para que pase
	// la validación client-side. fill() NO dispara esos eventos → se usa pressSequentially.
	async typeCardNumber(card: string) {
		await I.usePlaywrightTo(
			'type card number character by character to trigger keydown/keypress validation events',
			async ({ page }) => {
				// Selector confirmado via MCP Playwright: id="username2", label "Número de tarjeta"
				const field = page.locator('#username2')
				await field.waitFor({ timeout: 30000 })
				await field.pressSequentially(card, { delay: 50 })
			}
		)
	}

	async submitLoginWithToken(token: string) {
		const tokenSelector = this.tokenField
		await I.usePlaywrightTo(
			'click Continuar, fill token if prompted, and complete login',
			async ({ page }) => {
				// Click the initial Continuar button
				const continueBtn = page.getByRole('button', {
					name: /continuar/i,
				})
				await continueBtn.waitFor({ timeout: 30000 })
				await continueBtn.click()
				await page.waitForTimeout(3000)

				// Check if the token page appeared and handle it
				try {
					const tokenInput = page.locator(tokenSelector)
					await tokenInput.waitFor({ timeout: 8000 })
					await tokenInput.fill(token)
					const tokenContinue = page.getByRole('button', {
						name: /continuar/i,
					})
					await tokenContinue.click()
					await page.waitForTimeout(3000)
				} catch {
					// Token page did not appear — login completed in a single step
				}
			}
		)
	}
}

export = new BbvaLoginPage()
