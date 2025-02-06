const { I, login } = inject()

Given('Im logged in', async () => {
	I.wait(10)
})
// ejemplo de step para hacer uso del autologin
Given(/^Im logged in as "([^"]*)"$/, async (profile: profileType) => {
	await login(profile)
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
