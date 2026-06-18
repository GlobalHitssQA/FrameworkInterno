import loginPage from '../pages/loginPage'
import './PosicionGlobalSteps'
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

// ── CP1 — F - Posición Global - Generico ─────────────────────────────────────
// Los steps de login de CP1 usan typeCardNumber (pressSequentially) porque la
// validación JS del formulario BBVA requiere eventos keydown/keypress por carácter.
// El step "the global position page should be displayed" se reutiliza desde PosicionGlobalSteps.ts

Given(/^I navigate to the BBVA online banking login page$/, () => {
	bbvaLoginPage.navigateToLoginUrl()
})

When(
	/^I enter the card number "([^"]*)" and the password "([^"]*)"$/,
	async (card: string, password: string) => {
		await bbvaLoginPage.typeCardNumber(card)
		await bbvaLoginPage.enterPassword(password)
	}
)

When(/^I click the login button$/, async () => {
	await bbvaLoginPage.clickLoginButton()
})

Then(/^the debit account section should be visible$/, async () => {
	await posicionGlobalPage.verifyDebitAccountVisible()
})

Then(/^the credit card section should be visible$/, async () => {
	await posicionGlobalPage.verifyCreditCardVisible()
})
