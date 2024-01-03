const { I } = inject()

class DataPage {
	fields: {
		nextButtonText: string
		idButton: string
		mmeApplication: string
		place: string
		headDate: string
		policyType: string
		contratante: string
		firstLastName: string
		secondLastName: string
		medicalSummary: string
		name: string
		country: string
		state: string
		nationality: string
		ocupation: string
		rfc: string
	}

	constructor() {
		this.fields = {
			nextButtonText: '//*[@id="journey-footer"]/div[2]/button[2]',
			idButton: '#scrollView1',
			mmeApplication: '#scrollView2',
			place: '//input[contains(@name,"PLACE")]',
			headDate: '//label[contains(text(),"Día Mes Año")]/..//input',
			policyType:
				'//label[contains(text(),"Datos del tipo de póliza")]/..//input',
			contratante:
				'//label[contains(text(),"Nombre del Contratante o razón social")]/..//input',
			firstLastName:
				'//input[contains(@name,"CONTACTING_PARTY_LAST_NAME")]',
			secondLastName:
				'//input[contains(@name,"CONTACTING_PARTY_SECOND_LAST_NAME")]',
			name: '//input[contains(@name,"CONTACTING_PARTY_FIRST_NAME")]',
			country:
				'//input[contains(@name,"CONTACTING_PARTY_COUNTRY_OF_BIRTH")]',
			state: '//input[contains(@name,"CONTACTING_PARTY_STATE_OF_BIRTH")]',
			nationality:
				'//input[contains(@name,"CONTACTING_PARTY_NATIONALITY")]',
			ocupation: '//input[contains(@name,"CONTACTING_PARTY_OCCUPATION")]',
			rfc: '//input[contains(@name,"CONTACTING_PARTY_RFC_NO")]',
			medicalSummary: '#scrollView3',
		}
	}

	fillDataFields() {
		I.waitForElement(this.fields.idButton, 10)
		I.click(this.fields.idButton)
		I.click(this.fields.mmeApplication)
		I.click(this.fields.nextButtonText)
	}
}

export = new DataPage()
