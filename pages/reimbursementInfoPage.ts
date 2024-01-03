const { I } = inject()

class ReimbursementInfoPage {
	fields: {
		typeOfClaim: string
		typeOfProcedure: string
		medicalAttention: string
		abroadProcedure: string
		noMetEmployee: string
		contactEmail: string
		emergencyNumber: string
		submitButton: string
	}

	constructor() {
		this.fields = {
			typeOfClaim: '#typeOfClaim',
			typeOfProcedure: '#typeOfProcedure',
			medicalAttention: '#typeOfAdmission',
			abroadProcedure: '#YessurgeryServiceTypeAbroad',
			noMetEmployee: '#NometlifeEmployee',
			contactEmail: 'input[name=contactEmail]',
			emergencyNumber: 'input[name=emergencyPhoneNumber]',
			submitButton: 'Submit',
		}
	}

	fillReimbursementInfo(
		claimType: string,
		procedureType: string,
		abroadBool: string,
		metEmployee: string,
		admissionType: string,
		email: string,
		contactNumber: string
	) {
		if (claimType === 'Complementary') {
			// Se usa el siguiente método para seleccionar la opción ya que I.selectOption() manda error
			I.usePlaywrightTo('seleccionando', async ({ page }) => {
				await page
					.locator(this.fields.typeOfClaim)
					.selectOption('Complementary')
			})
		}
		switch (procedureType) {
			case 'Traditional':
				I.usePlaywrightTo('seleccionando', async ({ page }) => {
					await page
						.locator(this.fields.typeOfProcedure)
						.selectOption('Traditional')
				})
				break
			default:
				I.usePlaywrightTo('seleccionando', async ({ page }) => {
					await page
						.locator(this.fields.medicalAttention)
						.selectOption('Traditional')
				})
		}
		if (abroadBool === 'Yes') {
			I.click(this.fields.abroadProcedure)
		}
		if (metEmployee === 'No') {
			I.click(this.fields.noMetEmployee)
		}
		switch (admissionType) {
			case 'Accident':
				I.usePlaywrightTo('seleccionando', async ({ page }) => {
					await page
						.locator(this.fields.medicalAttention)
						.selectOption('Accident')
				})
				break
			default:
				I.usePlaywrightTo('seleccionando', async ({ page }) => {
					await page
						.locator(this.fields.medicalAttention)
						.selectOption('Accident')
				})
		}
		I.fillField(this.fields.contactEmail, email)
		I.fillField(this.fields.emergencyNumber, contactNumber)
		I.click(this.fields.submitButton)
		I.wait(10)
	}
}

export = new ReimbursementInfoPage()
