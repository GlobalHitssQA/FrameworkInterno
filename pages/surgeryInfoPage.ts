const { I } = inject()

class SurgeryInfoPage {
	fields: {
		typeOfClaim: string
		illnessDetails: string
		abroadSurgery: string
		noMetEmployee: string
		typeOfAdmission: string
		contactEmail: string
		emergencyNumber: string
		hospitalName: string
		hospitalSearchButton: string
		hospitalSelection: string
		doctorName: string
		doctorSearchButton: string
		doctorSelection: string
		auxService: string
		serviceSearchButton: string
		serviceSelection: string
		submitButtonText: string
	}

	constructor() {
		this.fields = {
			typeOfClaim: '#typeOfClaim',
			illnessDetails: 'input[name=illnessDetails]',
			abroadSurgery: '#YessurgeryServiceTypeAbroad',
			noMetEmployee: '#NometlifeEmployee',
			typeOfAdmission: '#typeOfAdmission',
			contactEmail: 'input[name=contactEmail]',
			emergencyNumber: 'input[name=emergencyPhoneNumber]',
			hospitalName: 'input[name=hospitalName]',
			hospitalSearchButton:
				'//div/div/div/div[2]/div/form/div[1]/div/div/div[2]/button',
			hospitalSelection:
				'//div/div/div/div[2]/div/form/div[1]/div/div[2]/div/label',
			doctorName: 'input[name=doctorName]',
			doctorSearchButton:
				'//div/div/div/div[3]/div/form/div[1]/div/div[1]/div[2]/button',
			doctorSelection:
				'//div/div/div/div[3]/div/form/div[1]/div/div[2]/div/label',
			auxService: 'input[name=auxiliaryName]',
			serviceSearchButton:
				'//div/div/div/div[4]/div/form/div[1]/div/div/div[2]/button',
			serviceSelection:
				'//div/div/div/div[4]/div/form/div[1]/div/div[2]/div[1]/label',
			submitButtonText: 'Submit',
		}
	}

	fillProgramInfo(
		claimType: string,
		abroadBool: string,
		metEmployee: string,
		illnessDetails: string,
		admissionType: string,
		email: string,
		contactNumber: string,
		hospital: string,
		doctor: string,
		adicional: string
	) {
		if (claimType === 'Complementary') {
			// Se usa el siguiente método para seleccionar la opción ya que I.selectOption() manda error
			I.usePlaywrightTo('seleccionando', async ({ page }) => {
				await page
					.locator(this.fields.typeOfClaim)
					.selectOption('Complementary')
			})
		}
		if (abroadBool === 'Yes') {
			I.click(this.fields.abroadSurgery)
		}
		if (metEmployee === 'No') {
			I.click(this.fields.noMetEmployee)
		}
		I.fillField(this.fields.illnessDetails, illnessDetails)
		switch (admissionType) {
			case 'Accident':
				I.usePlaywrightTo('seleccionando', async ({ page }) => {
					await page
						.locator(this.fields.typeOfAdmission)
						.selectOption('Accident')
				})
				break
			default:
				I.usePlaywrightTo('seleccionando', async ({ page }) => {
					await page
						.locator(this.fields.typeOfAdmission)
						.selectOption('Accident')
				})
		}
		I.fillField(this.fields.contactEmail, email)
		I.fillField(this.fields.emergencyNumber, contactNumber)
		I.fillField(this.fields.hospitalName, hospital)
		I.click(this.fields.hospitalSearchButton)
		I.waitForElement(this.fields.hospitalSelection, 5)
		I.click(this.fields.hospitalSelection)
		I.fillField(this.fields.doctorName, doctor)
		I.click(this.fields.doctorSearchButton)
		I.waitForElement(this.fields.doctorSelection, 5)
		I.click(this.fields.doctorSelection)
		I.fillField(this.fields.auxService, adicional)
		I.click(this.fields.serviceSearchButton)
		I.waitForElement(this.fields.serviceSelection, 10)
		I.click(this.fields.serviceSelection)
		I.click(this.fields.submitButtonText)
	}
}

export = new SurgeryInfoPage()
