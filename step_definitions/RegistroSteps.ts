import loginPage from '../pages/loginPage'

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
