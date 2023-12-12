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

	fillProgramInfo() {
		// Se usa el siguiente método para seleccionar la opción ya que I.selectOption() manda error
		I.usePlaywrightTo('seleccionando', async ({ page }) => {
			await page
				.locator(this.fields.typeOfClaim)
				.selectOption('Complementary')
		})
		I.click(this.fields.abroadSurgery)
		I.click(this.fields.noMetEmployee)
		I.fillField(this.fields.illnessDetails, 'Hombro roto')
		I.usePlaywrightTo('seleccionando', async ({ page }) => {
			await page
				.locator(this.fields.typeOfAdmission)
				.selectOption('Accident')
		})
		I.fillField(this.fields.contactEmail, 'isidrocarrasco@prueba.com')
		I.fillField(this.fields.emergencyNumber, '6730776222')
		I.fillField(this.fields.hospitalName, 'HOSPITAL ANGELES METROPOLITANO')
		I.click(this.fields.hospitalSearchButton)
		I.waitForElement(this.fields.hospitalSelection, 5)
		I.click(this.fields.hospitalSelection)
		I.fillField(this.fields.doctorName, 'Vianney Roman Garcia')
		I.click(this.fields.doctorSearchButton)
		I.waitForElement(this.fields.doctorSelection, 5)
		I.click(this.fields.doctorSelection)
		I.fillField(this.fields.auxService, 'Laboratorio')
		I.click(this.fields.serviceSearchButton)
		I.waitForElement(this.fields.serviceSelection, 10)
		I.click(this.fields.serviceSelection)
		I.click(this.fields.submitButtonText)
		I.wait(10)
	}
}

export = new SurgeryInfoPage()
